/* ============================================================
   Love For — shared helpers & compression
   ============================================================ */

const SITE_UPI_ID = "yogimanikantaare@oksbi";
const SITE_UPI_NAME = "Love For";

function encodeData(obj){
  const json = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeData(str){
  try{
    let s = str.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const json = decodeURIComponent(escape(atob(s)));
    return JSON.parse(json);
  }catch(e){
    return null;
  }
}

function hashParam(){
  return location.hash ? location.hash.slice(1) : "";
}

// Builds a secure UPI deep link intent for mobile apps (GPay / PhonePe / Paytm)
function buildUpiLink({ amount, note, refId }){
  const params = new URLSearchParams({
    pa: SITE_UPI_ID,
    pn: SITE_UPI_NAME,
    tn: note || "Love For order",
    am: amount ? String(amount) : "",
    cu: "INR"
  });
  if (refId) params.set("tr", refId);
  return "upi://pay?" + params.toString();
}

function genRefId(){
  return "LF" + Date.now().toString(36).toUpperCase();
}

// Compresses uploaded images via canvas to ensure shareable URLs remain compact and short
function compressImage(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 500;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress to JPEG with 0.75 quality to dramatically shrink URL size
      callback(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function fireConfetti(root){
  const colors = ["#E8637A", "#D8A441", "#3F8C8C", "#F7F0E4"];
  for (let i = 0; i < 60; i++){
    const el = document.createElement("div");
    const size = 6 + Math.random() * 6;
    el.style.cssText = `
      position:fixed; top:-20px; left:${Math.random()*100}vw;
      width:${size}px; height:${size*0.4}px;
      background:${colors[i % colors.length]};
      opacity:${0.7 + Math.random()*0.3};
      transform: rotate(${Math.random()*360}deg);
      z-index: 9999; pointer-events:none; border-radius:2px;
    `;
    (root || document.body).appendChild(el);
    const duration = 2600 + Math.random() * 1800;
    el.animate([
      { transform: el.style.transform + " translateY(0)", opacity: 1 },
      { transform: `translateY(100vh) rotate(${720 + Math.random()*360}deg)`, opacity: 0 }
    ], { duration, easing: "cubic-bezier(.2,.6,.4,1)" });
    setTimeout(() => el.remove(), duration + 50);
  }
}

function qs(sel, root){ return (root || document).querySelector(sel); }
function qsa(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }
