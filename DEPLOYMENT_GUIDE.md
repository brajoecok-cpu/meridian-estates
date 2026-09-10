# Meridian Estates — Production Deployment & Launch Guide

This document outlines the zero-downtime deployment process for **Meridian Estates** to Vercel, Sanity CMS, and custom domain routing.

---

## 🚀 1. Deploying to Vercel

1. Push the repository to GitHub / GitLab.
2. Log into the [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import the `meridian-estates` directory.
4. Set the **Framework Preset** to `Next.js`.
5. Under **Environment Variables**, paste the following keys (from `.env.example`):
   ```env
   NEXT_PUBLIC_SITE_URL=https://meridian-estates.com
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_sanity_token
   CRM_WEBHOOK_URL=https://api.hubspot.com/...
   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_CLARITY_ID=your_clarity_project_id
   ```
6. Click **Deploy**.

---

## 🌐 2. Custom Domain & DNS Records

In Vercel's **Settings → Domains**:
- Add your primary apex domain `meridian-estates.com` and subdomain `www.meridian-estates.com`.
- Configure DNS with your registrar:
  - **A Record**: `@` → `76.76.21.21`
  - **CNAME**: `www` → `cname.vercel-dns.com`

---

## 🎨 3. Accessing Sanity Studio in Production

Once deployed:
1. Navigate to `https://meridian-estates.com/studio`.
2. In your Sanity management console (`sanity.io/manage`), add `https://meridian-estates.com` to **API → CORS Origins** (with *Allow Credentials* enabled).
3. Editors can now publish new developments, edit pricing, and swap room videos with live 60-second Incremental Static Regeneration (ISR).

---

## 📋 4. Production QA Verification Checklist

- [x] **Accessibility & Contrast**: 4.5:1 text-over-video contrast met with radial/linear dark gradient overlays.
- [x] **Reduced Motion**: Respects `prefers-reduced-motion: reduce` OS settings across all routes.
- [x] **SEO Schema**: Google Rich Results validated `RealEstateListing` and `RealEstateAgent` JSON-LD schemas.
- [x] **Sitemap & Robots**: Automated `sitemap.xml` and `robots.txt` dynamic generation.
- [x] **Lead Capture**: Encrypted VIP viewing forms with server-side validation and CRM webhook forwarding.
- [x] **Adaptive Video Streaming**: Multi-bitrate HLS and local MP4 playback with lazy loading.
