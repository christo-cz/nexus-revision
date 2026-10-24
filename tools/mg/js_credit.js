/* ---------- author credit (same block on every Nexus page) ---------- */
const ME = { name: "Christo Czysz", cls: "EDHEC BBA1, English track, Lille campus", insta: "christo.cz", linkedin: "https://www.linkedin.com/in/christo-czysz-2a133a43a", mail: ["christo.czysz", "edhec.com"] };
const ICONS = {
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
  li: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.2v.1M12 17v-6.5M12 13.4c0-1.7 1-2.9 2.5-2.9S17 11.4 17 13v4"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>'
};
function creditHtml(){
  const mail = ME.mail.join("@");
  return `<section class="credit" aria-label="About the author"><div class="who"><b>Made by ${ME.name}</b><span>${ME.cls}</span></div>
    <div class="links"><a href="https://www.instagram.com/${ME.insta}/" target="_blank" rel="noopener">${ICONS.ig}@${ME.insta}</a><a href="${ME.linkedin}" target="_blank" rel="noopener">${ICONS.li}LinkedIn</a><a href="mailto:${mail}">${ICONS.mail}${mail}</a></div></section>`;
}

