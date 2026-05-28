# Deploy to a live URL (Vercel + Neon)

This app is a **Next.js** project with **PostgreSQL**. The fastest way to get a public link is [Vercel](https://vercel.com) (free tier) + [Neon](https://neon.tech) (free Postgres).

## 1. Database (Neon)

1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a project → copy the **connection string** (starts with `postgresql://`)
3. In your project folder, run once (with `.env` set locally):

   ```powershell
   npx prisma db push
   ```

## 2. Push code to GitHub

1. Create a new repo on GitHub (e.g. `ai-app-generator`)
2. In **this project folder only** (not your whole user folder):

   ```powershell
   cd "c:\Users\DhanyaSri\Downloads\internship assessment"
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

## 3. Deploy on Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. **Import** your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Add **Environment Variables** (Production):

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | Your Neon connection string |
   | `NEXTAUTH_SECRET` | Random string (`openssl rand -base64 32` or any long password) |
   | `NEXTAUTH_URL` | `https://YOUR-PROJECT.vercel.app` (use your Vercel URL after first deploy, then redeploy) |
   | `SMTP_USER` / `SMTP_PASS` | Optional — only if you need email OTP |

5. Click **Deploy**
6. After deploy, open **Settings → Environment Variables**, set `NEXTAUTH_URL` to your real URL (e.g. `https://ai-app-generator-xyz.vercel.app`), then **Redeploy**

Your live link will look like: **`https://your-project-name.vercel.app`**

## 4. CLI alternative (from this folder)

```powershell
npm i -g vercel
vercel login
vercel
```

Follow prompts; add the same env vars in the Vercel dashboard when asked.

## Troubleshooting

- **Build fails**: Run `npm run build` locally and fix errors first.
- **Database errors**: Run `npx prisma db push` against your production `DATABASE_URL` (or use Neon SQL editor after tables exist).
- **Auth redirect issues**: `NEXTAUTH_URL` must exactly match your public URL (no trailing slash).
