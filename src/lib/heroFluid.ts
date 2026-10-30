// Pointer-driven "liquid smear" over the Hero background.
//
// The pointer's velocity is written into a small half-float texture that is
// advected, diffused and faded every frame (a lightweight take on the fluid
// simulation behind Arnaud Rocca's portfolio, without its pressure solve or
// any library). A second pass samples the same background image, displaced
// along that velocity and blurred in proportion to it, and draws it over the
// CSS background with an alpha equal to the effect's strength: where nothing
// moved the canvas is fully transparent, so the original image is untouched.
//
// On top of the smear there is a water layer: the same texture also holds a
// height field (z = height, w = previous height) stepped with the wave
// equation, so every movement sends out rings. The render pass bends the image
// along the slope of that field (refraction) and lights it from one side.
//
// Only runs for a fine pointer with hover and without reduced motion; the
// loop stops by itself a few seconds after the pointer rests.

export interface HeroFluid {
  destroy(): void;
}

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const SIM_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform float uDt;
uniform float uAspect;
uniform vec2 uPoint;
uniform vec2 uVel;
uniform float uRadius;
void main() {
  vec4 self = texture(uPrev, vUv);
  vec2 v = self.xy;
  // Self-advection: the field drags itself along its own direction.
  vec2 adv = texture(uPrev, vUv - v * 0.035 * uDt).xy;
  // Diffusion: soften toward the neighbours.
  vec2 avg = 0.25 * (
    texture(uPrev, vUv + vec2(uTexel.x, 0.0)).xy +
    texture(uPrev, vUv - vec2(uTexel.x, 0.0)).xy +
    texture(uPrev, vUv + vec2(0.0, uTexel.y)).xy +
    texture(uPrev, vUv - vec2(0.0, uTexel.y)).xy);
  vec2 nv = mix(adv, avg, min(0.35 * uDt, 1.0));
  // Fade, independent of the display's refresh rate.
  nv *= pow(0.95, uDt);
  // Pointer splat.
  vec2 d = vUv - uPoint;
  d.x *= uAspect;
  nv += uVel * exp(-dot(d, d) / uRadius);
  nv = clamp(nv, -1.0, 1.0);
  if (length(nv) < 0.002) nv = vec2(0.0);

  // Water: wave equation on a height field (height in z, previous in w).
  float wsum =
    texture(uPrev, vUv + vec2(uTexel.x, 0.0)).z +
    texture(uPrev, vUv - vec2(uTexel.x, 0.0)).z +
    texture(uPrev, vUv + vec2(0.0, uTexel.y)).z +
    texture(uPrev, vUv - vec2(0.0, uTexel.y)).z;
  float h = (wsum * 0.5 - self.w) * pow(0.925, uDt);
  // Each movement drops a ring-making bump along the pointer's path.
  h += min(length(uVel) * 0.9, 0.42) * exp(-dot(d, d) / (uRadius * 0.7));
  h = clamp(h, -0.5, 0.5);
  if (abs(h) < 0.0004 && abs(self.z) < 0.0004) h = 0.0;
  outColor = vec4(nv, h, self.z);
}`;

const RENDER_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uSim;
uniform sampler2D uImg;
uniform vec2 uCover;
uniform vec2 uTexel;
void main() {
  vec4 s = texture(uSim, vUv);
  vec2 v = s.xy;
  // Slope of the water surface.
  vec2 g = 0.5 * vec2(
    texture(uSim, vUv + vec2(uTexel.x, 0.0)).z - texture(uSim, vUv - vec2(uTexel.x, 0.0)).z,
    texture(uSim, vUv + vec2(0.0, uTexel.y)).z - texture(uSim, vUv - vec2(0.0, uTexel.y)).z);
  float slope = length(g);
  float m = smoothstep(0.015, 0.7, length(v) * 1.5);
  float wave = smoothstep(0.0005, 0.004, slope);
  // Calm water: nothing to draw, so skip the image fetches.
  if (m <= 0.0 && wave <= 0.0) {
    outColor = vec4(0.0);
    return;
  }
  // Refraction through the water plus the old smear.
  vec2 uv = (vUv - 0.5) * uCover + 0.5 - v * 0.05 - g * 0.28 * uCover;
  float r = 0.01 * m;
  vec3 c = texture(uImg, uv).rgb;
  for (int i = 0; i < 8; i++) {
    if (m <= 0.0) break;
    float a = 6.2831853 * float(i) / 8.0;
    c += texture(uImg, uv + vec2(cos(a), sin(a)) * r).rgb;
  }
  c /= (m > 0.0 ? 9.0 : 1.0);
  // Light from the upper left: slopes facing it shine, the others darken.
  float lit = dot(g, normalize(vec2(-0.55, 0.83)));
  c += vec3(1.0, 0.9, 0.62) * max(lit, 0.0) * 2.4;
  c *= 1.0 - min(max(-lit, 0.0) * 4.0, 0.25);
  c = clamp(c, 0.0, 1.0);
  float alpha = max(smoothstep(0.0, 0.3, m), wave);
  outColor = vec4(c * alpha, alpha);
}`;

interface Target {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function link(gl: WebGL2RenderingContext, frag: string): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "aPos");
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function makeTarget(gl: WebGL2RenderingContext, w: number, h: number): Target | null {
  const tex = gl.createTexture();
  const fbo = gl.createFramebuffer();
  if (!tex || !fbo) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return ok ? { tex, fbo } : null;
}

export function createHeroFluid(container: HTMLElement, imageUrl: string): HeroFluid | null {
  if (typeof window === "undefined") return null;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reducedMotion.matches) return null;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";

  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return null;

  const simProgram = link(gl, SIM_FRAG);
  const renderProgram = link(gl, RENDER_FRAG);
  if (!simProgram || !renderProgram) return null;

  const vao = gl.createVertexArray();
  const vbo = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const simU = {
    prev: gl.getUniformLocation(simProgram, "uPrev"),
    texel: gl.getUniformLocation(simProgram, "uTexel"),
    dt: gl.getUniformLocation(simProgram, "uDt"),
    aspect: gl.getUniformLocation(simProgram, "uAspect"),
    point: gl.getUniformLocation(simProgram, "uPoint"),
    vel: gl.getUniformLocation(simProgram, "uVel"),
    radius: gl.getUniformLocation(simProgram, "uRadius"),
  };
  const renderU = {
    sim: gl.getUniformLocation(renderProgram, "uSim"),
    img: gl.getUniformLocation(renderProgram, "uImg"),
    cover: gl.getUniformLocation(renderProgram, "uCover"),
    texel: gl.getUniformLocation(renderProgram, "uTexel"),
  };

  let destroyed = false;
  let imageTex: WebGLTexture | null = null;
  let imageAspect = 1;
  let targets: [Target, Target] | null = null;
  let simW = 0;
  let simH = 0;
  let rafId = 0;
  let running = false;
  let lastTime = 0;
  let activeUntil = 0;
  let lastX = -1;
  let lastY = -1;
  const pending = { has: false, x: 0, y: 0, vx: 0, vy: 0 };

  function disposeTargets() {
    if (!targets || !gl) return;
    for (const t of targets) {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fbo);
    }
    targets = null;
  }

  function resize() {
    if (!gl || destroyed) return;
    const rect = container.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    // About a third of the resolution is plenty: the effect is a blur and is stretched by CSS.
    const w = Math.max(2, Math.round(rect.width * 0.35));
    const h = Math.max(2, Math.round(rect.height * 0.35));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const sw = 144;
    const sh = Math.max(16, Math.round((144 * rect.height) / rect.width));
    if (!targets || sw !== simW || sh !== simH) {
      disposeTargets();
      const a = makeTarget(gl, sw, sh);
      const b = makeTarget(gl, sw, sh);
      if (!a || !b) {
        destroy();
        return;
      }
      targets = [a, b];
      simW = sw;
      simH = sh;
      for (const t of targets) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.viewport(0, 0, sw, sh);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
  }

  function frame(now: number) {
    if (destroyed || !gl || !targets || !imageTex) {
      running = false;
      return;
    }
    const dt = Math.min((now - (lastTime || now)) / 16.667, 3) || 1;
    lastTime = now;

    const [read, write] = targets;
    gl.bindVertexArray(vao);

    gl.bindFramebuffer(gl.FRAMEBUFFER, write.fbo);
    gl.viewport(0, 0, simW, simH);
    gl.useProgram(simProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, read.tex);
    gl.uniform1i(simU.prev, 0);
    gl.uniform2f(simU.texel, 1 / simW, 1 / simH);
    gl.uniform1f(simU.dt, dt);
    gl.uniform1f(simU.aspect, simW / simH);
    if (pending.has) {
      gl.uniform2f(simU.point, pending.x, pending.y);
      gl.uniform2f(simU.vel, pending.vx, pending.vy);
      gl.uniform1f(simU.radius, (0.0035 + Math.min(Math.hypot(pending.vx, pending.vy), 1) * 0.004) * 0.7);
      pending.has = false;
      pending.vx = 0;
      pending.vy = 0;
    } else {
      gl.uniform2f(simU.point, 0, 0);
      gl.uniform2f(simU.vel, 0, 0);
      gl.uniform1f(simU.radius, 0.01);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    targets = [write, read];

    const canvasAspect = canvas.width / canvas.height;
    const sx = canvasAspect > imageAspect ? 1 : canvasAspect / imageAspect;
    const sy = canvasAspect > imageAspect ? imageAspect / canvasAspect : 1;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(renderProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, write.tex);
    gl.uniform1i(renderU.sim, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, imageTex);
    gl.uniform1i(renderU.img, 1);
    gl.uniform2f(renderU.cover, sx, sy);
    gl.uniform2f(renderU.texel, 1 / simW, 1 / simH);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (now < activeUntil) {
      rafId = requestAnimationFrame(frame);
    } else {
      running = false;
      lastTime = 0;
    }
  }

  function start() {
    if (running || destroyed || !imageTex) return;
    running = true;
    lastTime = 0;
    rafId = requestAnimationFrame(frame);
  }

  function onPointerMove(event: PointerEvent) {
    if (destroyed || document.hidden) return;
    // Only while the Hero is on screen.
    if (window.scrollY > window.innerHeight * 0.9) {
      lastX = -1;
      return;
    }
    const rect = container.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      lastX = -1;
      return;
    }
    if (lastX >= 0) {
      const dx = (x - lastX) * 18;
      const dy = (y - lastY) * 18 * (rect.height / rect.width);
      const len = Math.hypot(dx, dy);
      const k = len > 1 ? 1 / len : 1;
      pending.vx += dx * k;
      pending.vy += dy * k;
      pending.x = x;
      pending.y = y;
      pending.has = true;
      activeUntil = performance.now() + 1500;
      start();
    }
    lastX = x;
    lastY = y;
  }

  function onReducedMotionChange() {
    if (reducedMotion.matches) destroy();
  }

  function onContextLost(event: Event) {
    event.preventDefault();
    destroy();
  }

  const resizeObserver = new ResizeObserver(resize);

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener("pointermove", onPointerMove);
    reducedMotion.removeEventListener("change", onReducedMotionChange);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    resizeObserver.disconnect();
    disposeTargets();
    if (imageTex) gl?.deleteTexture(imageTex);
    imageTex = null;
    canvas.remove();
  }

  const image = new Image();
  image.decoding = "async";
  image.onload = () => {
    if (destroyed || !gl) return;
    const tex = gl.createTexture();
    if (!tex) {
      destroy();
      return;
    }
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    imageTex = tex;
    imageAspect = image.naturalWidth / image.naturalHeight;
    container.appendChild(canvas);
    resize();
    resizeObserver.observe(container);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  };
  image.onerror = () => destroy();
  image.src = imageUrl;

  canvas.addEventListener("webglcontextlost", onContextLost);
  reducedMotion.addEventListener("change", onReducedMotionChange);

  return { destroy };
}
