# AI Engineer Tracker — setup & deploy

A private, password-gated progress tracker at **`/tracker`**, with progress
persisted server-side (so it syncs across your devices). Built to match the
existing Next.js App Router + Tailwind stack. Nothing here touches the public
site — it's purely additive.

## What was added

```
src/lib/tracker/plan.ts        # the 28-week plan data + types
src/lib/tracker/auth.ts        # edge-safe cookie-token helpers
src/middleware.ts              # gates /tracker + /api/progress behind the cookie
src/app/api/login/route.ts     # POST verify password → set cookie; DELETE → logout
src/app/api/progress/route.ts  # GET/PUT progress, stored in Upstash Redis
src/app/tracker/login/page.tsx # password screen
src/app/tracker/page.tsx       # the tracker UI (checklist, progress bar, notes)
.env.example                   # the new env vars
package.json                   # + @upstash/redis
```

## How the auth works

A single shared password gates the area. The password itself is **never**
stored in the cookie — the login route derives a SHA-256 token from
`TRACKER_PASSWORD` + `TRACKER_SECRET` and stores that in an `httpOnly` cookie.
The middleware recomputes the expected token and compares. If the env vars are
missing, the middleware fails closed (everything stays locked).

This is right-sized for a personal, single-user tracker. It is **not** a
multi-user auth system — don't put anything sensitive behind it. Upgrading to
Auth.js later is straightforward if you ever want real accounts.

## One-time setup (≈ 20 minutes)

### 1. Install the new dependency
```bash
npm install
```

### 2. Add a Redis store on Vercel
- Vercel dashboard → your project → **Storage** → **Create Database** →
  **Upstash** (via the Marketplace) → Redis → follow the prompts.
- When it asks, **connect it to this project**. Vercel automatically injects the
  Redis credentials into the project's environment variables — you don't copy
  anything by hand. The Marketplace integration names them `KV_REST_API_URL`
  and `KV_REST_API_TOKEN`; the code reads those automatically (and also accepts
  `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` if you ever switch to a
  direct Upstash setup). **No renaming needed.**

### 3. Add the two tracker env vars
In Vercel → project → **Settings → Environment Variables**, add (for all
environments, or at least Production + Preview):

| Name | Value |
|---|---|
| `TRACKER_PASSWORD` | the password you'll type to get in |
| `TRACKER_SECRET`   | a long random string — run `openssl rand -hex 32` |

### 4. Deploy
Merge the branch (or push it). Vercel builds and deploys automatically.
Visit **`https://www.aquidigital.co.uk/tracker`**, enter your password, and
your progress will save as you tick weeks off.

## Local development (optional)
```bash
cp .env.example .env.local   # then fill in the four values
npm run dev
```
Without the two Upstash values locally, the UI still runs — it just shows a
"storage isn't connected" note and won't persist until you add them (or deploy).

## Changing the password later
Update `TRACKER_PASSWORD` in Vercel and redeploy. (Changing `TRACKER_SECRET`
also works and has the side effect of logging out any existing session.)
