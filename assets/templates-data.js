/* ============================================================
   Love For — template catalogue
   Edit prices, copy, and Razorpay Payment Links here.
   Each `payLink` should be a Razorpay Payment Link URL you create
   in your Razorpay dashboard (Payment Links > + Create).
   IMPORTANT: set that Payment Link's "Redirect URL after payment"
   to  https://<your-domain>/pay.html  (see README for details).
   ============================================================ */

const TEMPLATES = [
  {
    id: "birthday",
    name: "Birthday Wish",
    icon: "🎂",
    accent: "#E8637A",
    tagline: "An envelope that opens into a full birthday surprise — wishes, a photo and a letter.",
    price: 149,
    payLink: "", // e.g. "https://rzp.io/l/abc123" — leave blank to use UPI-only checkout
    eyebrow: "you've got a surprise",
    heroTitle: "Happy Birthday, {to}",
    heroBody: "Someone made you something. Keep going.",
    reasonsLabel: "A few birthday wishes",
    letterLabel: "One more thing",
    order: ["hero", "reasons", "photo", "song", "letter"]
  },
  {
    id: "anniversary",
    name: "Anniversary Special",
    icon: "💫",
    accent: "#D8A441",
    tagline: "A countdown, your story so far, and a closing letter worth keeping.",
    price: 179,
    payLink: "",
    eyebrow: "a milestone, marked",
    heroTitle: "To {to}, on us",
    heroBody: "Every year gets its own page. Here's this one.",
    reasonsLabel: "Chapters of our story",
    letterLabel: "The part that matters",
    order: ["hero", "photo", "reasons", "song", "letter"]
  },
  {
    id: "apology",
    name: "I'm Sorry",
    icon: "🌷",
    accent: "#C43F58",
    tagline: "The sincere way to say sorry when a text isn't enough.",
    price: 129,
    payLink: "",
    eyebrow: "before you scroll past",
    heroTitle: "I'm sorry, {to}",
    heroBody: "Not a text this time. Read the whole thing.",
    reasonsLabel: "What I should have said",
    letterLabel: "The honest part",
    order: ["hero", "letter", "reasons", "photo", "song"]
  },
  {
    id: "friendship",
    name: "For a Best Friend",
    icon: "🤝",
    accent: "#3F8C8C",
    tagline: "Inside jokes, memories and a note for the person who's seen it all.",
    price: 149,
    payLink: "",
    eyebrow: "open this properly",
    heroTitle: "Hey {to}, it's about you",
    heroBody: "A page for the person who's been there since forever.",
    reasonsLabel: "Reasons you're stuck with me",
    letterLabel: "Say less, mean more",
    order: ["hero", "reasons", "photo", "letter", "song"]
  },
  {
    id: "love-note",
    name: "Love Note",
    icon: "💌",
    accent: "#E8637A",
    tagline: "A short, sweet love page. Free — no reason to wait.",
    price: 0,
    payLink: "",
    eyebrow: "for you",
    heroTitle: "A note for {to}",
    heroBody: "Read slowly.",
    reasonsLabel: "Reasons, in no order",
    letterLabel: "Last thing",
    order: ["hero", "letter", "reasons", "photo"]
  }
];

function getTemplate(id){
  return TEMPLATES.find(t => t.id === id);
}
