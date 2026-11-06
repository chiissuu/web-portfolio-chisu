// One-shot reveals for phones and tablets (where the desktop's scroll-driven
// light paths and pinned rows are not drawn). Each element is hidden by a class,
// and the first time it comes into view it fades up (or opens as a circle) once.
// Then the classes are taken off, so the element goes back to its own styles
// (hover transforms, focus rings, shadows) and nothing keeps running.
//
// Cost on a phone: one IntersectionObserver, and a transition of opacity and
// transform (or of a clip-path, once) per element: no scroll handler, no
// per-frame style work.
//
// Always call it inside `gsap.matchMedia().add(query, ...)` and return the
// cleanup it gives back, so the elements are restored if the width crosses the
// breakpoint or the animations are switched off.

export type RevealKind = "up" | "iris";

export function revealOnEnter(
  targets: Array<HTMLElement | null | undefined>,
  kind: RevealKind = "up",
  stagger = 80
): () => void {
  const els = targets.filter((el): el is HTMLElement => !!el);
  if (!els.length || !("IntersectionObserver" in window)) return () => {};

  const cls = kind === "iris" ? "m-iris" : "m-rev";
  const timers = new Set<number>();
  const settle = (el: HTMLElement) => {
    el.classList.remove(cls, "m-in");
    el.style.removeProperty("--m-d");
  };

  els.forEach((el) => el.classList.add(cls));

  const io = new IntersectionObserver(
    (entries) => {
      let order = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        const delay = order++ * stagger;
        el.style.setProperty("--m-d", `${delay}ms`);
        // Make sure the hidden state has been laid out before it changes.
        void el.offsetWidth;
        el.classList.add("m-in");
        timers.add(window.setTimeout(() => settle(el), delay + 1300));
      });
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    timers.forEach((t) => window.clearTimeout(t));
    els.forEach(settle);
  };
}
