# Christo Ponnadurai Memorial Website
## Deployment Guide — Cloudflare Pages

---

## Project Structure

```
christo-memorial/
├── index.html                  ← Main memorial page (edit placeholders here)
├── admin.html                  ← Admin panel (access at /admin)
├── functions/
│   └── api/
│       └── condolences.js      ← Serverless API (handles condolences storage)
└── DEPLOYMENT.md               ← This file
```

---

## Step 1 — Edit the Memorial Content

Before deploying, open `index.html` in any text editor and fill in the sections
marked with `✏️ UPDATE:` comments. Key things to personalise:

- **Hero dates** — replace `[Birth Year]` and `[Year of Passing]`
- **Hero tagline** — a phrase that captures who Christo was
- **Biography paragraphs** — his story, heritage, life in Melbourne
- **Timeline milestones** — key years and events
- **Eulogies** — paste in the eulogy texts and speakers' names
- **Photos** — place image files in the project folder and replace placeholder divs with `<img>` tags
- **Footer dates** — update the years

---

## Step 2 — Create a Cloudflare Account & Deploy

1. Go to **https://dash.cloudflare.com** and sign in (or create a free account).

2. In the left sidebar, click **Pages** → **Create a project** → **Connect to Git**
   - Connect your GitHub account and push this project folder to a new GitHub repository
   - Select the repository and click **Begin setup**
   - Leave build settings empty (no build command, no build output directory needed)
   - Click **Save and Deploy**

   **— OR — (no Git needed)**
   Click **Upload assets** instead, then drag-and-drop the entire project folder.

3. Your site will be live at a `*.pages.dev` URL within a minute.

---

## Step 3 — Set Up KV Storage (for Condolences)

The condolences system uses Cloudflare KV (key-value storage). This is free.

1. In Cloudflare dashboard, go to **Workers & Pages** → **KV**
2. Click **Create a namespace**
3. Name it `condolences` → **Add**

4. Go back to **Pages** → your project → **Settings** → **Functions**
5. Scroll to **KV namespace bindings** → **Add binding**
   - Variable name: `CONDOLENCES_KV`
   - KV namespace: select `condolences`
   - Click **Save**

---

## Step 4 — Set Your Admin Password

1. Still in **Settings** → **Functions** → scroll to **Environment variables**
2. Click **Add variable**
   - Variable name: `ADMIN_PASSWORD`
   - Value: choose a strong password (e.g. `Christo2025!`)
   - Click the **Encrypt** toggle to make it a secret
   - Click **Save**

3. **Trigger a new deployment** so the settings take effect:
   Go to **Deployments** tab → click **Retry deployment** on the latest deployment.

---

## Step 5 — Point christo.ponnadurai.com to the site

Since you own `ponnadurai.com` and want the site at `christo.ponnadurai.com`:

1. In **Pages** → your project → **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `christo.ponnadurai.com` → **Continue**

4. Cloudflare will show you a DNS record to add. Because you own `ponnadurai.com`,
   log into wherever you manage that domain's DNS (likely Cloudflare itself):

   - Go to **Websites** → `ponnadurai.com` → **DNS** → **Records**
   - Add a **CNAME** record:
     - Name: `christo`
     - Target: `<your-project>.pages.dev`
     - Proxy status: **Proxied** (orange cloud)
   - Save

5. Back in Pages custom domains, click **Activate domain**
6. It can take a few minutes to propagate. Your site will then be live at
   **https://christo.ponnadurai.com** with a free SSL certificate.

---

## Step 6 — Access the Admin Panel

Navigate to: **https://christo.ponnadurai.com/admin**

- Enter the `ADMIN_PASSWORD` you set in Step 4
- You'll see all submitted condolences in three tabs: **Pending**, **Published**, **All**
- Click **Approve & Publish** to make a message visible on the public site
- Click **Delete** to permanently remove any message (spam, bots, etc.)

> **Important:** New condolences are held as "pending" until you approve them.
> This means no spam or inappropriate content can appear without your review.

---

## Ongoing Maintenance

### Adding photos
Place image files (e.g. `christo1.jpg`) in the project folder alongside `index.html`.
In `index.html`, replace a `<div class="gallery-placeholder">` with:
```html
<img src="christo1.jpg" alt="Christo at ...">
```
Then re-upload or push to GitHub to redeploy.

### Updating content
Edit `index.html` directly and redeploy. Any text editor works — no coding needed
beyond copy-pasting.

### Adding more eulogies
In `index.html`, copy an existing `eulogy-card` block and paste it before the
`eulogy-placeholder` div. Fill in the text and speaker name.

---

## Free tier limits (Cloudflare Pages + KV)

Cloudflare's free tier is generous for a memorial site:
- **Pages**: Unlimited requests, 500 deployments/month
- **KV**: 100,000 read operations/day, 1,000 write operations/day, 1 GB storage
- **Functions**: 100,000 invocations/day

This is more than enough for a memorial site receiving a few hundred visitors.

---

*Built with Cloudflare Pages + KV. No server required.*
