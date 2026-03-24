# ShipTrack — Changelog & Feature Board SaaS

A white-label changelog and feature voting platform you can run on Vercel's free tier.

**ShipTrack** lets indie hackers and micro-SaaS founders add a professional changelog and public feature board to their product in minutes — without building it themselves.

---

## Features

- 🔐 **Auth** — Sign up / sign in (NextAuth.js)
- 📝 **Changelog** — Post updates tagged as feature, fix, or improvement
- 💡 **Feature Board** — Visitors submit ideas and vote (browser fingerprint deduplication)
- 📊 **Dashboard** — Manage your product, entries, and board in one place
- 🔌 **Embed Widget** — One script tag drops a styled changelog or board on any website
- 🌗 **Dark mode** — Auto-detected from `prefers-color-scheme`

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Database | Neon Postgres (free tier) |
| Cache / KV | Upstash Redis (free tier) |
| Auth | NextAuth.js |
| File Storage | Vercel Blob |
| Deploy | Vercel (Hobby free tier) |

---

## Quick Start (Local)

### 1. Clone and install

```bash
cd shiptrack
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

```env
# Neon Postgres (get free tier at neon.tech)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Upstash Redis (get free tier at upstash.com)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# NextAuth (generate a secret)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# (Optional) Vercel Blob for file uploads
BLOB_READ_WRITE_TOKEN="..."
```

### 3. Push the database schema

```bash
npx prisma db push
```

This creates all tables (users, products, changelog_entries, feature_requests, votes) in your Neon database.

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create shiptrack --public --push
```

### 2. Connect to Vercel

```bash
npm i -g vercel
vercel
```

Or import the repo in the [Vercel dashboard](https://vercel.com).

### 3. Add environment variables

In Vercel → Project → Settings → Environment Variables, add:

- `DATABASE_URL` (Neon connection string)
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` = `https://your-project.vercel.app`
- `BLOB_READ_WRITE_TOKEN` (optional)

### 4. Deploy

```bash
vercel --prod
```

---

## Usage

### Sign up

Visit `/auth/signup` to create an account. Passwords are hashed with bcrypt.

### Create a product

1. Sign up / sign in
2. Go to Dashboard → "New Product"
3. Enter name, slug, description
4. Copy the embed code snippet

### Embed the widget

In your product's website, add:

**Changelog only:**
```html
<div id="shiptrack-changelog"></div>
<script src="https://your-shiptrack-domain.com/embed.js" data-slug="your-product-slug" data-type="changelog"></script>
```

**Feature board only:**
```html
<div id="shiptrack-board"></div>
<script src="https://your-shiptrack-domain.com/embed.js" data-slug="your-product-slug" data-type="board"></script>
```

Both widgets are self-contained and inherit dark/light mode automatically.

---

## Vercel Hobby Limits (what works / what doesn't)

| Resource | Limit | ShipTrack usage |
|----------|-------|----------------|
| Serverless invocations | 1M/mo | ✅ Light API calls |
| Active CPU | 4 CPU-hrs/mo | ✅ Read-heavy, minimal compute |
| CDN bandwidth | 100 GB/mo | ✅ No media-heavy content |
| Blob storage | 1 GB | ✅ Docs/text, no large files |
| Cron jobs | Once/day max | ✅ No cron needed |

**Does NOT fit Hobby:** User file uploads at scale, media-heavy sites, high-traffic real-time apps.

---

## Project Structure

```
shiptrack/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   └── embed.js                # Client-side embed widget
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # Public changelog page
│   │   │       └── board/
│   │   │           ├── page.tsx      # Public feature board
│   │   │           └── _components/
│   │   │               └── FeatureBoardClient.tsx
│   │   ├── api/
│   │   │   ├── embed/[slug]/changelog/route.ts
│   │   │   ├── embed/[slug]/board/route.ts
│   │   │   └── products/[slug]/features/[id]/vote/route.ts
│   │   ├── auth/
│   │   ├── dashboard/
│   │   │   ├── [slug]/changelog/new/
│   │   │   ├── [slug]/board/
│   │   │   └── [slug]/page.tsx
│   │   └── page.tsx            # Landing page
│   ├── components/ui/          # shadcn/ui components
│   └── lib/
│       ├── auth.ts             # NextAuth config
│       ├── db.ts               # Prisma client
│       └── redis.ts            # Upstash Redis client
└── README.md
```

---

## License

MIT
