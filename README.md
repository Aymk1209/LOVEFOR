# Love For

A small, no-login personalised-gift-page site. Pick one of five pages,
fill in your own words + a photo link, pay once (or free for one template),
get a single shareable link. Everything runs client-side — there's no
server, database, or login, so it deploys as plain static files.

## How the "no backend" trick works

A personalised page's content lives entirely in the **URL itself**
(`view.html#<base64-encoded-json>`). There's nothing to host per order —
the link *is* the data. That's what makes this deployable on GitHub Pages
with zero backend.

## File map

```
index.html              home page + template gallery
create.html              personalisation form
pay.html                 payment step (Razorpay + UPI)
view.html                the actual rendered gift page (reads data from the URL)
templates/*.html         preview pages (seeded with sample data)
assets/style.css         all styling
assets/templates-data.js template catalogue — prices, copy, Razorpay links
assets/app.js            encode/decode, UPI link + QR builder, confetti
assets/view-engine.js    renders a gift page from data + template config
```

## 1. Deploying it (two good free options)

### Option A — GitHub Pages (what you asked for)
1. Create a new **public** GitHub repo, e.g. `love-for`.
2. Upload this whole folder's contents to the repo root (drag-and-drop
   on github.com works fine, or `git push`).
3. Repo → **Settings → Pages** → Source: `Deploy from a branch` →
   Branch: `main`, folder `/ (root)` → Save.
4. Your site is live in a minute or two at
   `https://<your-username>.github.io/love-for/`.
5. Whenever you edit a file, commit it — the site rebuilds automatically.

Free forever, no build step, exactly matches what you described.

### Option B — Netlify (slightly smoother, also free)
Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) and
it's live immediately with a `.netlify.app` URL — no GitHub needed, though
you can still connect a GitHub repo for auto-deploys on push.

**Which is better for you:** GitHub Pages is completely fine for this site as
it stands — it's 100% static, so there's nothing Netlify gives you here that
you actually need *yet*. The one reason to prefer Netlify later is if you
ever want to add a real backend function (e.g. to verify Razorpay payments
server-side instead of trusting the browser redirect) — Netlify Functions
make that a small addition, whereas GitHub Pages can't run any server code
at all. Start on GitHub Pages; move only if you outgrow it.

Both support a **custom domain** for free — you just point your domain's
DNS at them, same idea as Cutiepage's own "add your domain" feature.

## 2. Setting up real payments (Razorpay)

Right now `assets/templates-data.js` has `payLink: ""` for every paid
template, so the site currently only offers the UPI QR / deep-link option
(functional, but not auto-verified — see the security note below).

To add proper Razorpay checkout:

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com) with
   your business details and complete KYC (needed before you can accept
   live payments — usually a couple of days for approval; test mode works
   immediately).
2. **Payment Links → + Create Payment Link.**
   - Amount: match the template price (e.g. ₹149 for Birthday Wish).
   - Under **Advanced options → Redirect URL**, turn on "Redirect after
     payment" and set it to:
     `https://<your-username>.github.io/love-for/pay.html?t=birthday`
     (swap `birthday` for the matching template id — `anniversary`,
     `apology`, `friendship`, `love-note`).
   - Save, then copy the generated link (looks like `https://rzp.io/l/xxxx`).
3. Paste that link into `assets/templates-data.js` as that template's
   `payLink`. Repeat per paid template.
4. Commit + push — the "Pay with Razorpay" button appears automatically.

When someone pays, Razorpay redirects them back to `pay.html` with
`razorpay_payment_id` and `razorpay_payment_link_status=paid` in the URL —
the site detects that and finishes building their page automatically.

## 3. About the UPI option

The UPI card on `pay.html` builds a standard `upi://pay` link + QR pointing
at **yogimanikantaare@oksbi**, and opens whatever UPI app the visitor has
installed. It's genuinely useful (zero setup, works today), but be clear-eyed
about its one limitation: **nothing on a static site can verify a UPI
payment actually happened.** The "I've paid — continue" button takes the
visitor's word for it. That's fine for people you trust (friends buying a
page, or you sending someone a link yourself), but for strangers paying
online, prefer the Razorpay button — it's the one that's actually confirmed.

If you later want UPI payments verified automatically too, that requires a
backend (Razorpay's UPI Payment Links / webhook, or a small serverless
function) — a natural next step once you're on Netlify or similar.

## 4. Editing prices, copy, or adding a template

Everything content-wise lives in `assets/templates-data.js` — prices,
taglines, hero copy, section order. Duplicate one entry and give it a new
`id` to add a sixth template; add a matching `templates/<id>.html` preview
file (copy an existing one and swap the id).

## 5. Photos and songs

There's no image upload (that would need a backend/storage). The photo
field just takes a **link** to an image already hosted somewhere — Google
Photos (shared link), Imgur, etc. Songs work the same way with a YouTube or
Spotify link, which gets turned into an embedded player automatically.
