# 🤖 AI App Generator

> A powerful, metadata-driven full-stack application platform that transforms JSON configurations into production-ready applications — with built-in authentication, OTP email verification, database management, CSV operations, multi-language support, and PWA capabilities.

🌐 **Live Demo:** [https://ai-app-generator-sand.vercel.app](https://ai-app-generator-sand.vercel.app)

---

## 📖 Introduction

AI App Generator is a **metadata-driven application runtime** built on Next.js 16. Instead of manually coding every CRUD screen, you define your app's structure in a JSON config — and the platform automatically renders forms, tables, dashboards, and API routes at runtime.

The project was built as part of a **Track A — End-to-End Platform** challenge, covering:
- Secure user authentication with OTP email verification
- Dynamic UI generation from JSON metadata
- Virtual database schema using PostgreSQL (no migrations needed per feature)
- Workflow automation, notifications, CSV import/export, and project export as ZIP

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.2 (App Router) |
| **Language** | TypeScript 5 |
| **Frontend** | React 19, Tailwind CSS 4, Framer Motion |
| **Authentication** | NextAuth.js v4 + Prisma Adapter |
| **OTP / Email** | Nodemailer (Gmail SMTP) |
| **Database** | PostgreSQL via Neon.tech |
| **ORM** | Prisma 5 |
| **Forms & Validation** | React Hook Form + Zod |
| **CSV Handling** | PapaParse |
| **ZIP Export** | JSZip |
| **Password Hashing** | bcryptjs |
| **Deployment** | Vercel |

---

## 🏗 Project Structure

```
AI-App-Generator/
├── prisma/
│   └── schema.prisma          # DB models: User, Application, DynamicData, Notification, OtpCode
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth + send-otp + verify-otp + register routes
│   │   │   ├── apps/           # CRUD API for Application metadata
│   │   │   ├── data/           # Dynamic data runtime API
│   │   │   ├── export/         # ZIP project export
│   │   │   └── notifications/  # Notification hub API
│   │   ├── dashboard/          # Main app dashboard
│   │   ├── login/              # Login page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable UI components
│   ├── lib/
│   │   ├── db.ts               # Prisma client
│   │   └── email.ts            # Nodemailer SMTP config
│   └── middleware.ts           # Route protection middleware
├── .env.example                # Environment variable template
├── next.config.ts
├── tailwind.config.*
└── package.json
```

---

## ⚙️ Methodology

The platform follows a **Single-Source-of-Truth** architecture:

1. **Metadata Definition** — An `AppConfig` JSON object defines fields, types, labels, validations, and translations.
2. **Dynamic Rendering** — The `Renderer` component reads the config and generates the correct UI (Table / Form / Dashboard) automatically.
3. **Runtime API** — API routes handle all CRUD operations dynamically based on the app's metadata — no per-model endpoints needed.
4. **Virtual Schema** — All app data is stored in a single `DynamicData` table as JSON, keyed by `appId` and `modelName`, eliminating the need for per-feature DB migrations.
5. **OTP Auth Flow** — On signup/login, the user enters credentials → server validates → generates a 6-digit OTP → sends via Gmail SMTP → user verifies OTP → session is created via NextAuth.

### Authentication Flow
```
User fills form → POST /api/auth/register (or send-otp)
  → Prisma creates user (bcrypt hashed password)
  → OTP generated & stored in OtpCode table
  → Email sent via Nodemailer (Gmail SMTP)
  → User enters OTP → POST /api/auth/verify-otp
  → Session created via NextAuth
```

---

## ✨ Key Features

- 🔐 **Secure Auth** — Email + Password + OTP 2-step verification via Gmail
- 🧠 **Metadata-Driven UI** — Auto-generates Tables, Forms, Dashboards from JSON config
- 🗄️ **Virtual DB Schema** — Flexible PostgreSQL storage without per-feature migrations
- ⚡ **Workflow Automation** — `ON_CREATE` triggers for business logic automation
- 🔔 **Notification Hub** — Real-time alert center for system and workflow events
- 🌍 **i18n / Multi-language** — Instant EN/ES translation switching
- 📊 **CSV Import/Export** — Bulk data operations with automatic field mapping
- 📁 **Project Export** — Download full app metadata as a deployable ZIP
- 📲 **PWA Ready** — Responsive design with Progressive Web App support

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- A PostgreSQL database (free tier: [neon.tech](https://neon.tech))
- A Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled

### Step 1 — Clone the Repository
```bash
git clone https://github.com/Yukta062006/AI-App-Generator.git
cd AI-App-Generator
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database (PostgreSQL - get free DB at neon.tech)
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-random-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"

# Gmail SMTP (for OTP emails)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
```

> **Gmail App Password:** Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), enable 2FA, then generate an App Password for "Mail".

### Step 4 — Set Up the Database
```bash
# Push schema to your PostgreSQL database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Step 5 — Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6 — Build for Production
```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import this repository
3. Vercel auto-detects **Next.js** — no build config changes needed
4. Add the following **Environment Variables** in Vercel project settings:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | A random 32+ character secret |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Your Gmail App Password |

5. Click **Deploy** ✅

🌐 **Live URL:** [https://ai-app-generator-sand.vercel.app](https://ai-app-generator-sand.vercel.app)

---

## 🗄️ Database Schema

| Model | Purpose |
|-------|---------|
| `User` | Stores registered users with hashed passwords |
| `Account` | NextAuth OAuth accounts linked to users |
| `Session` | Active user sessions |
| `OtpCode` | Time-limited OTP codes for email verification |
| `Application` | App metadata (JSON config) |
| `DynamicData` | All app data stored as JSON (virtual schema) |
| `Notification` | System and workflow notifications |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (runs `prisma generate` first) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma db push` | Sync schema to database |
| `npx prisma studio` | Open Prisma database GUI |

---

## 👩‍💻 Author

**Yukta Thakur**
- GitHub: [@Yukta062006](https://github.com/Yukta062006)
- LinkedIn: [Yukta Thakur](https://www.linkedin.com/in/yukta-thakur-38251a328)
---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
