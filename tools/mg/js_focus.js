function focusCard(card, instant){
  if (!card) return;
  if (card.classList.contains("card")) card.dispatchEvent(new CustomEvent("focuscard", { bubbles: true, detail: card }));
  card.scrollIntoView({ block: "center", behavior: instant || matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  const target = card.querySelector("input:not([disabled]), .opt:not([disabled])") || card.querySelector("[data-act='next']");
  if (target) setTimeout(() => target.focus({ preventScroll: true }), instant ? 0 : 380);
}
