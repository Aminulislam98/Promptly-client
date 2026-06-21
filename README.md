# Promptly — AI Prompt Sharing & Marketplace

Promptly is a platform where people can share, discover, and copy AI prompts for tools like ChatGPT, Claude, Midjourney, and more. Users can browse free prompts or unlock premium ones with a one-time $5 payment.

**Live site:** https://promptly-client-plum.vercel.app  
**Server:** https://promptly-server-ten.vercel.app

---

## What it does

- Browse and search prompts by category, AI tool, and difficulty
- Copy any prompt to clipboard with one click
- Free users can publish up to 3 prompts, premium users get unlimited
- Premium membership unlocks all private prompts ($5 one-time via Stripe)
- Bookmark prompts to save them for later
- Leave ratings and reviews on prompts
- Apply to become a Creator to share prompts with the community
- Admin panel to approve/reject prompts, manage users, and view reports

---

## Tech stack

**Frontend**
- Next.js 15 (App Router)
- Tailwind CSS v4
- Better Auth (email/password + Google OAuth)
- Framer Motion
- Recharts
- Stripe (payments)
- imgbb (image uploads)
- Lucide React

**Backend**
- Node.js + Express
- MongoDB
- JWT

---

## Getting started

Clone the repo and install dependencies:

```bash
npm install
```

Create a `.env.local` file in the root with these variables:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_key
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

Then run the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`. Make sure the backend is also running at `http://localhost:4000`.

---

## Folder structure

```
src/
  app/          # All pages (App Router)
  components/   # Reusable UI components
  lib/          # API functions, auth client, utilities
public/         # Static assets
```

---

## Key features breakdown

| Feature | Details |
|---|---|
| Auth | Email/password and Google via Better Auth |
| Roles | User, Creator, Admin |
| Payments | Stripe one-time checkout, $5 lifetime |
| Prompt limit | Free users: 3 prompts max |
| Image upload | Thumbnails via imgbb API |
| Analytics | Dashboard charts via Recharts |
