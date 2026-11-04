/* Motion switch, loaded synchronously in <head> before anything else.
   Animations are ON for everyone (the operating system's "reduce motion" is
   deliberately not followed); a visitor turns them off with the nav button, and
   the choice is kept in localStorage ("chiissuu:motion" = "off").
   It does two things:
   1. sets html[data-motion="on|off"], which the CSS keys off;
   2. answers every `prefers-reduced-motion` media query (CSS never sees this,
      but the scripts and gsap.matchMedia do) from that choice, so each
      component keeps asking the same question it always did.
   It is a separate file, not an inline script, because the Content Security
   Policy only allows inline scripts that Astro has hashed. */
(function () {
  var off = false;
  try {
    off = localStorage.getItem("chiissuu:motion") === "off";
  } catch (e) {}
  document.documentElement.setAttribute("data-motion", off ? "off" : "on");

  var ask = window.matchMedia.bind(window);
  var ALWAYS = "(min-width: 0px)";
  var NEVER = "(min-width: 99999px)";
  window.matchMedia = function (query) {
    if (typeof query === "string" && query.indexOf("prefers-reduced-motion") !== -1) {
      query = query
        .replace(/\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/g, off ? ALWAYS : NEVER)
        .replace(/\(\s*prefers-reduced-motion\s*:\s*no-preference\s*\)/g, off ? NEVER : ALWAYS);
    }
    return ask(query);
  };
})();
