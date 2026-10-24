// Localised "water" ripple on loose Hero elements (wordmark, headline, tagline,
// note, chips, metrics) while the pointer moves over them.
//
// The background effect (heroFluid.ts) paints its own canvas. These elements
// are ordinary DOM nodes the Hero animates and morphs, so instead of redrawing
// them each one gets an SVG filter: feTurbulence noise, weighted by a soft
// round blob that follows the pointer, drives an feDisplacementMap. Outside
// the blob the map is neutral grey, i.e. no displacement. The filter is only
// applied (through the `hx-water-on` class) to elements near the pointer while
// the Hero is at rest, and removed again once the motion dies down.
//
// Only for a fine pointer with hover and without reduced motion.

export interface HeroWater {
  destroy(): void;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const BLOB = 380; // blob diameter in px
const MAX_SCALE = 44; // displacement in px at full pointer speed
const IDLE_MS = 1500;
const NEAR = BLOB * 0.55;
const ACTIVE_CLASS = "hx-water-on";

const BLOB_URI =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="${SVG_NS}" width="${BLOB}" height="${BLOB}" viewBox="0 0 ${BLOB} ${BLOB}">` +
      `<defs><radialGradient id="g"><stop offset="0" stop-color="#fff" stop-opacity="1"/>` +
      `<stop offset="0.45" stop-color="#fff" stop-opacity="0.7"/>` +
      `<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="${BLOB}" height="${BLOB}" fill="url(#g)"/></svg>`,
  );

interface Target {
  el: HTMLElement;
  image: SVGElement;
  displace: SVGElement;
  on: boolean;
}

function buildFilter(index: number): { filter: SVGFilterElement; image: SVGElement; displace: SVGElement } {
  const filter = document.createElementNS(SVG_NS, "filter");
  filter.setAttribute("id", `hx-water-${index}`);
  filter.setAttribute("x", "-10%");
  filter.setAttribute("y", "-10%");
  filter.setAttribute("width", "120%");
  filter.setAttribute("height", "120%");
  filter.setAttribute("color-interpolation-filters", "sRGB");

  const make = (name: string, attrs: Record<string, string>) => {
    const node = document.createElementNS(SVG_NS, name);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };

  const turbulence = make("feTurbulence", {
    type: "fractalNoise",
    baseFrequency: "0.0055 0.0095",
    numOctaves: "1",
    seed: String((index % 7) + 2),
    result: "noise",
  });
  const opaque = make("feColorMatrix", {
    in: "noise",
    type: "matrix",
    values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1",
    result: "noiseOpaque",
  });
  const image = make("feImage", {
    href: BLOB_URI,
    x: "-9999",
    y: "-9999",
    width: String(BLOB),
    height: String(BLOB),
    preserveAspectRatio: "none",
    result: "blob",
  });
  const weighted = make("feComposite", { in: "noiseOpaque", in2: "blob", operator: "in", result: "weighted" });
  const neutral = make("feFlood", { "flood-color": "rgb(128,128,128)", "flood-opacity": "1", result: "neutral" });
  const merge = make("feMerge", { result: "map" });
  merge.append(make("feMergeNode", { in: "neutral" }), make("feMergeNode", { in: "weighted" }));
  const displace = make("feDisplacementMap", {
    in: "SourceGraphic",
    in2: "map",
    scale: "0",
    xChannelSelector: "R",
    yChannelSelector: "G",
  });

  filter.append(turbulence, opaque, image, weighted, neutral, merge, displace);
  return { filter, image, displace };
}

export function createHeroWater(selectors: readonly string[]): HeroWater | null {
  if (typeof window === "undefined") return null;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reducedMotion.matches) return null;

  const elements = selectors.flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)));
  if (elements.length === 0) return null;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
  const defs = document.createElementNS(SVG_NS, "defs");
  svg.append(defs);

  const targets: Target[] = elements.map((el, i) => {
    const { filter, image, displace } = buildFilter(i);
    defs.append(filter);
    el.style.setProperty("--hx-water", `url(#${filter.id})`);
    return { el, image, displace, on: false };
  });
  document.body.append(svg);

  let destroyed = false;
  let rafId = 0;
  let running = false;
  let lastTime = 0;
  let lastMove = 0;
  let energy = 0;
  let px = -1;
  let py = -1;
  let sx = -1;
  let sy = -1;
  let prevX = -1;
  let prevY = -1;
  let prevT = 0;

  const atRest = () =>
    window.scrollY < 4 && !document.documentElement.classList.contains("hx-intro-locked");

  function setOff(target: Target) {
    if (!target.on) return;
    target.on = false;
    target.displace.setAttribute("scale", "0");
    target.image.setAttribute("x", "-9999");
    target.el.classList.remove(ACTIVE_CLASS);
  }

  function allOff() {
    for (const t of targets) setOff(t);
  }

  function frame(now: number) {
    if (destroyed) return;
    const dt = Math.min((now - (lastTime || now)) / 16.667, 3) || 1;
    lastTime = now;

    energy *= Math.pow(0.93, dt);
    if (sx < 0) {
      sx = px;
      sy = py;
    }
    // The ripple trails slightly behind the cursor.
    sx += (px - sx) * Math.min(0.3 * dt, 1);
    sy += (py - sy) * Math.min(0.3 * dt, 1);

    if (!atRest() || (energy < 0.012 && now - lastMove > IDLE_MS)) {
      allOff();
      running = false;
      lastTime = 0;
      return;
    }

    // Read every rect first, then write, to avoid layout thrash.
    const rects = targets.map((t) => t.el.getBoundingClientRect());
    const strength = energy * MAX_SCALE;
    targets.forEach((target, i) => {
      const r = rects[i];
      const dx = Math.max(r.left - sx, 0, sx - r.right);
      const dy = Math.max(r.top - sy, 0, sy - r.bottom);
      const near = dx * dx + dy * dy < NEAR * NEAR && r.width > 0 && r.height > 0;
      if (!near || strength < 0.4) {
        setOff(target);
        return;
      }
      if (!target.on) {
        target.on = true;
        target.el.classList.add(ACTIVE_CLASS);
      }
      target.image.setAttribute("x", (sx - r.left - BLOB / 2).toFixed(1));
      target.image.setAttribute("y", (sy - r.top - BLOB / 2).toFixed(1));
      target.displace.setAttribute("scale", strength.toFixed(2));
    });

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running || destroyed) return;
    running = true;
    lastTime = 0;
    rafId = requestAnimationFrame(frame);
  }

  function onPointerMove(event: PointerEvent) {
    if (destroyed || document.hidden || !atRest()) return;
    const now = performance.now();
    px = event.clientX;
    py = event.clientY;
    if (prevX >= 0 && now > prevT) {
      const speed = Math.hypot(px - prevX, py - prevY) / Math.max(now - prevT, 8); // px per ms
      energy = Math.min(1, Math.max(energy, speed * 0.9));
    }
    prevX = px;
    prevY = py;
    prevT = now;
    lastMove = now;
    start();
  }

  function onReducedMotionChange() {
    if (reducedMotion.matches) destroy();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener("pointermove", onPointerMove);
    reducedMotion.removeEventListener("change", onReducedMotionChange);
    for (const t of targets) {
      t.el.classList.remove(ACTIVE_CLASS);
      t.el.style.removeProperty("--hx-water");
    }
    svg.remove();
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  reducedMotion.addEventListener("change", onReducedMotionChange);
  return { destroy };
}
