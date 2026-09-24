# vxlious

> **vxlious** is a private educational archive for students. It provides verified access to legally authorized previous-year assessment materials, practice papers, revision PDFs, sample assessments, and structured study resources.
>
> *The platform feels like a premium private academic library rather than a typical school website.*

---

## 💎 Product Positioning & Principles

- **Brand:** `vxlious` is always written in lowercase.
- **Design Philosophy:** Inspired by modern Apple interfaces — **Liquid Glass**, translucent frosted surfaces, soft depth, refined typography, generous whitespace, and restrained micro-interactions.
- **Academic Integrity:** vxlious strictly bars unauthorized leaks, stolen examination materials, current live assessments, or answer keys intended for cheating. Only vetted, authorized previous-year curriculum archives are cataloged.
- **Privacy by Default:** Student data, verification certificates, and payment screenshots are isolated in private storage vaults with zero public bucket disclosure and 120-second ephemeral HMAC streaming tokens.

---

## 🛠 Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS with custom Liquid Glass design tokens & Dark/Light mode support
- **Icons:** Lucide Icons
- **Database & ORM:** Prisma ORM with SQLite (zero-config local) & PostgreSQL / Supabase migration ready
- **Authentication:** HTTP-only cookies, JSON Web Tokens via `jose`, and `bcryptjs` password hashing
- **Security & Storage:** Private filesystem vault, MIME validation, UUID storage keys, and short-lived HMAC signed tokens for PDF streaming

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+ (tested on v22.15.0)
- **npm** or **pnpm**

### 2. Clone & Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="vxlious-academic-archive-secret-key-super-secure-production-2026"
NEXT_PUBLIC_APP_NAME="vxlious"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STORAGE_DRIVER="local"
STORAGE_LOCAL_PATH="./data/storage"
```

### 4. Initialize Database & Seed
Push the Prisma schema and run the seed script:
```bash
# Push schema to SQLite database
npx prisma db push

# Seed subjects, quarters, sample authorized PDF archives, and test accounts
node scripts/seed.mjs
```

### 5. Launch the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Pre-Configured Test Credentials

| Role | Email | Password | Status | Access |
|---|---|---|---|---|
| **Super Admin** | `admin@vxlious.kz` | `Password123!` | Verified | Full Admin Panel (`/admin`), Review Verifications, Orders, Resources |
| **Verified Student** | `student@vxlious.kz` | `Password123!` | Verified | Library Unlocked with Active Academic License (`/library`) |
| **Applicant Student** | `applicant@vxlious.kz` | `Password123!` | Pending | Verification under review (`/dashboard`) |

> *One-click demo login buttons are also embedded on the `/login` page for fast testing.*

---

## 🏛 Application Structure & Routes

### Public Pages
- `/` — Apple-inspired Landing Page with animated glass visualization, 4-step workflow, subjects showcase, and FAQ.
- `/archive` — Interactive Subject Archive directory with instant search, debouncing, and filters (Subject, Year, Quarter, Document type).
- `/resource/[id]` — Resource detail view with metadata specifications, access verification, and purchase checkout modal.
- `/privacy` — Privacy Center detailing data collection, encryption, retention, and anti-leak compliance.
- `/support` — Academic Support Desk with category ticket filing and status tracking.
- `/login` & `/register` — Authentication portals with privacy guarantees.

### Student Portal (Authenticated)
- `/dashboard` — Student Dashboard (Overview, My Library, Purchases, Verification, Profile, Notifications).
- `/library` — My Academic Library showing all unlocked materials with 1-click reader launch.
- `/view/[id]` — Dedicated Immersive PDF Reader with student dynamic watermarking and security controls.
- `/verify` — Student Verification Portal for uploading student IDs and certificates.

### Administration Vault (`/admin/*`)
- `/admin` — Overview with KPI analytics (Users, Verified, Pending Reviews, Revenue, Resources, Activity).
- `/admin/verification` — Review pending student submissions, inspect private documents, approve or reject.
- `/admin/orders` — Review payment receipts, approve orders (which auto-grants resource access), or reject.
- `/admin/resources` — Upload authorized PDF documents, edit prices, set Content Authorization Status (`Authorized`, `Pending review`, `Rejected`), archive or delete.
- `/admin/users` — Search, filter, inspect student profiles, verify manually, or suspend accounts.
- `/admin/subjects` — Manage curriculum subjects, academic years, and quarters.
- `/admin/audit` — Cryptographic administrative audit trail logging all actions with timestamps and admin IDs.
- `/admin/settings` — Configure checkout payment instructions (Kaspi / Bank transfer details) and support contacts.

---

## 🛡 Security Architecture Highlights

1. **Private Storage & Ephemeral Tokens:**
   - Raw PDF files, student ID uploads, and receipts are stored outside the public directory (`./data/storage/private/`).
   - The PDF viewer requests short-lived HMAC-SHA256 signed access tokens (`/api/secure-file/token`) that expire in **120 seconds**.
   - Direct storage URLs are never exposed in the browser frontend.

2. **Server-Side Authorization:**
   - Client-side checks are never trusted alone.
   - Every file request verifies:
     1. Active authenticated session.
     2. Student verification standing.
     3. Active purchase access record in `resource_access`.

3. **Dynamic Digital Watermarking:**
   - The secure viewer projects a semi-transparent dynamic overlay containing the student's name, email, and timestamp across pages to discourage unauthorized reproduction.

4. **Content Authorization Lifecycle:**
   - Resources must hold `authorizationStatus = "Authorized"` to appear in public purchasing workflows.

---

## 🚢 Production Deployment

### Option A: Vercel + Supabase (PostgreSQL)
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase.sql`.
3. In `prisma/schema.prisma`, update the provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Set environment variables on Vercel:
   - `DATABASE_URL` (Supabase Connection Pooler string)
   - `JWT_SECRET` (Secure 32+ character random string)
   - `NEXT_PUBLIC_APP_URL` (Production domain)
5. Deploy repository directly to Vercel.

---

## 📄 License
vxlious Academic Archive — All rights reserved. For academic use only.
