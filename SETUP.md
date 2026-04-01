# Christo Ponnadurai Memorial — Deployment Guide

A step-by-step guide to deploying this site to **christo.ponnadurai.com** via Cloudflare Pages.

---

## What's in this project

```
christo-memorial/
├── index.html                          ← Main memorial page
├── admin.html                          ← Admin panel (manage condolences)
└── functions/
    └── api/
        ├── condolences.js              ← GET (list) + POST (add) condolences
        └── condolences/
            └── [id].js                 ← DELETE a specific condolence
```

---

## Part 1 — Fill in your father's details

Open `index.html` and search for every `✏️ EDIT:` comment. Update:

- His **birth and passing dates** (two places: hero section and footer)
- His **life story** paragraphs
- The **timeline** milestones
- Each **eulogy** (paste the text inside the `.eulogy-placeholder` div, replacing the placeholder comment)
- The **photo gallery** — replace the placeholder `<div>` items with `<img src="yourphoto.jpg" />` tags
- His **portrait photo** — replace the `life-photo-placeholder` div with `<img src="portrait.jpg" style="float:right; margin:0 0 2rem 2.5rem; width:260px;" />`

---

## Part 2 — Set up Cloudflare KV (for condolences storage)

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. In the left sidebar, go to **Workers & Pages → KV**
3. Click **Create a namespace**
4. Name it `CONDOLENCES_KV`
5. Click **Add** — you'll see a namespace ID. Keep this tab open.

---

## Part 3 — Deploy to Cloudflare Pages

### Option A: Deploy via GitHub (recommended)

1. Create a new GitHub repository (e.g. `christo-memorial`)
2. Push the entire `christo-memorial/` folder contents to it:
   ```bash
   cd christo-memorial
   git init
   git add .
   git commit -m "Initial memorial site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/christo-memorial.git
   git push -u origin main
   ```
3. In Cloudflare, go to **Workers & Pages → Pages**
4. Click **Create a project → Connect to Git**
5. Select your repository
6. **Build settings:**
   - Framework preset: `None`
   - Build command: *(leave empty)*
   - Build output directory: `/` (root)
7. Click **Save and Deploy** — wait ~30 seconds for the first deploy

### Option B: Upload directly (no GitHub needed)

1. In Cloudflare, go to **Workers & Pages → Pages**
2. Click **Create a project → Upload assets**
3. Name your project (e.g. `christo-memorial`)
4. Drag in all files from your `christo-memorial/` folder
   - ⚠️ Make sure to include the `functions/` folder — it's what powers the condolences
5. Click **Deploy site**

---

## Part 4 — Connect the KV namespace to your Pages project

1. In Cloudflare Pages, open your project → **Settings → Functions**
2. Scroll to **KV namespace bindings**
3. Click **Add binding**
4. Variable name: `CONDOLENCES_KV`
5. KV namespace: select `CONDOLENCES_KV` from the dropdown
6. Save

---

## Part 5 — Set your admin password

1. Still in Pages → **Settings → Environment variables**
2. Click **Add variable**
   - Variable name: `ADMIN_PASSWORD`
   - Value: *(choose a strong password — you'll use this to log in to /admin.html)*
3. Set it for **Production** (and optionally Preview)
4. Save and **redeploy** the project (go to Deployments → retry the latest deploy)

---

## Part 6 — Point christo.ponnadurai.com to your Pages project

1. In Cloudflare Pages → your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter `christo.ponnadurai.com`
4. Cloudflare will add a CNAME record in your DNS automatically since you're already using Cloudflare for `ponnadurai.com`
5. It may take a few minutes to become active

---

## Accessing the admin panel

- Go to `https://christo.ponnadurai.com/admin.html`
- Enter the `ADMIN_PASSWORD` you set in Step 5
- You can **delete** any condolence message that is inappropriate or spam

---

## Adding photos

Place photo files in your repository (e.g. in a `/photos/` folder), then reference them in `index.html`:

```html
<!-- Portrait (in the Life Story section) -->
<img src="/photos/portrait.jpg" style="float:right; margin:0 0 2rem 2.5rem; width:260px;" alt="Christo Ponnadurai" />

<!-- Gallery items (replace each placeholder div) -->
<img src="/photos/family-1.jpg" style="width:100%; aspect-ratio:1; object-fit:cover;" alt="Family portrait" />
```

---

## Ongoing updates

Each time you push changes to GitHub, Cloudflare Pages will automatically redeploy within a minute. If you used the direct upload method, simply return to the Pages project and upload updated files.
