/* ============================================================
   Love For — gift page renderer (Updated)
   ============================================================ */

function sampleDataFor(id){
  const base = {
    from: "Aarav",
    to: "Meera",
    message:
      "I don't say this enough, so I built a whole page to say it properly.\n\n" +
      "Thank you for the small things you probably don't even notice you do — " +
      "the voice notes, the terrible puns, staying up to talk about nothing.\n\n" +
      "This is the short version. Press play above and read slowly.",
    reasons: [
      "You remember things I mention once, in passing, weeks later.",
      "You make ordinary days feel like they were worth showing up for.",
      "You're the first person I want to tell anything good.",
      "You've never once made me feel small for asking twice."
    ],
    photoUrl: "",
    songUrl: "",
    date: ""
  };
  if (id === "anniversary") base.date = "2022-06-14";
  return base;
}

function embedFromSongUrl(url){
  if (!url) return "";
  try{
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")){
      let vid = u.searchParams.get("v");
      if (!vid && u.hostname.includes("youtu.be")) vid = u.pathname.slice(1);
      if (vid) return `<iframe src="https://www.youtube.com/embed/${vid}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }
    if (u.hostname.includes("spotify.com")){
      const path = u.pathname.replace("/track/", "/embed/track/").replace("/playlist/", "/embed/playlist/");
      return `<iframe src="https://open.spotify.com${path}" allow="encrypted-media"></iframe>`;
    }
  }catch(e){ /* not a valid URL — ignore */ }
  return "";
}

function daysSince(dateStr){
  if (!dateStr) return null;
  const then = new Date(dateStr);
  if (isNaN(then)) return null;
  const diff = Date.now() - then.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function sceneHero(cfg, data){
  const title = cfg.heroTitle.replace("{to}", data.to || "you");
  const days = daysSince(data.date);
  const embed = embedFromSongUrl(data.songUrl);

  return `
    <section class="scene" style="background:${cfg.accent}">
      <div class="eyebrow">${cfg.eyebrow}</div>
      <h2>${title}</h2>
      <p>${cfg.heroBody}</p>
      ${days !== null ? `<p style="margin-top:14px;font-size:15px;opacity:.8">${days} days, and counting</p>` : ""}
      
      ${embed ? `
        <div style="margin-top: 24px; width: 100%; display: flex; justify-content: center;">
          <div class="song-embed" style="max-width: 380px;">
            <p style="font-size: 12px; margin-bottom: 8px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px;">🎵 Press play & read along</p>
            ${embed}
          </div>
        </div>
      ` : ""}

      <div class="scroll-cue">scroll down to read your message ↓</div>
    </section>`;
}

function sceneReasons(cfg, data){
  const items = (data.reasons || []).filter(Boolean);
  if (!items.length) return "";
  return `
    <section class="scene" style="background:${cfg.accent}ee">
      <div class="eyebrow">${cfg.reasonsLabel}</div>
      <div class="reasons">
        ${items.map((r, i) => `
          <div class="reason-card">
            <div class="num">${String(i+1).padStart(2,"0")}</div>
            <div>${escapeHtml(r)}</div>
          </div>`).join("")}
      </div>
    </section>`;
}

function scenePhoto(cfg, data){
  if (!data.photoUrl) return "";
  return `
    <section class="scene" style="background:${cfg.accent}">
      <div class="photo-frame"><img src="${data.photoUrl}" alt="A photo of ${data.to || 'you'}" loading="lazy"></div>
      <p style="opacity:.8;font-size:14px; font-weight: 600;">Captured by ${data.from || "someone special"}</p>
    </section>`;
}

function sceneSong(cfg, data){
  // If song is already shown in hero, we can optionally skip or display as an extra dedication section
  return "";
}

function sceneLetter(cfg, data){
  return `
    <section class="scene" style="background:${cfg.accent}">
      <div class="eyebrow">${cfg.letterLabel}</div>
      <div class="letter">${escapeHtml(data.message || "")}
        <div class="sign">— With love, ${data.from || "someone who cares about you"}</div>
      </div>
    </section>`;
}

const SCENES = { hero: sceneHero, reasons: sceneReasons, photo: scenePhoto, song: sceneSong, letter: sceneLetter };

function escapeHtml(s){
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderGift(root, cfg, data){
  const order = cfg.order.filter(key => {
    if (key === "reasons") return (data.reasons || []).some(Boolean);
    if (key === "photo") return !!data.photoUrl;
    if (key === "song") return false; // Handled directly in hero for maximum emotional impact
    return true;
  });
  root.innerHTML = order.map(key => SCENES[key](cfg, data)).join("");
  document.title = (cfg.heroTitle.replace("{to}", data.to || "you")) + " · Love For";

  requestAnimationFrame(() => {
    const first = root.querySelector(".scene");
    if (first){
      first.animate(
        [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 700, easing: "cubic-bezier(.2,.7,.3,1)" }
      );
    }
  });
}
