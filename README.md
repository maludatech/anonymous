# Maluda Anonymous

An anonymous messaging platform built with Next.js. Users create an account and get a
personal, shareable link (`/send-message/[username]`). Anyone with that link can send
them a message without signing in or revealing who they are. The account owner reads and
manages what comes in from a private dashboard.

## Features

- **Account system** — email/username + password sign-up and sign-in, with password
  reset via emailed token.
- **Anonymous inbox** — a public `/send-message/[username]` page where anyone can send a
  message to a user with no login required.
- **Dashboard** — view and delete received messages, copy your shareable link.
- **Profile management** — update account details from `/profile`.
- **Transactional email** — welcome and password-reset emails sent via Resend
  (`emails/` holds the React Email templates).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [MongoDB](https://www.mongodb.com/) via Mongoose for data storage
- [`@node-rs/argon2`](https://github.com/napi-rs/node-rs) for password hashing,
  [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) for session tokens
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix
  primitives) for the UI
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for form
  validation
- [Resend](https://resend.com) + [React Email](https://react.email) for outbound email
- [Zustand](https://zustand-demo.pmnd.rs/) for client-side auth state

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root with:

| Variable              | Required | Description                                              |
| ---------------------- | -------- | ---------------------------------------------------------- |
| `MONGODB_URI`          | Yes      | MongoDB connection string.                                |
| `JWT_SECRET`           | Yes      | Secret used to sign/verify auth tokens.                   |
| `RESEND_API_KEY`       | Yes      | API key for sending transactional email via Resend.       |
| `NEXT_PUBLIC_APP_URL`  | Yes      | Public base URL of the app (used in emails and share links). |
| `APP_NAME`             | No       | Overrides the display name used across the app.           |
| `APP_SLOGAN`           | No       | Overrides the tagline shown on the landing page.           |
| `APP_DESCRIPTION`      | No       | Overrides the app description text.                        |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                                  |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Start the Next.js dev server.                |
| `npm run build`  | Build for production.                        |
| `npm run start`  | Run the production build.                    |
| `npm run lint`   | Run ESLint.                                  |
| `npm run test`   | Run the integration test suite (see below).  |
| `npm run email`  | Preview email templates with React Email's dev server. |

## Testing

Integration tests in `tests/` exercise the real API route handlers (sign-up, sign-in,
email verification, and the message-inbox auth check) against a real MongoDB — no
mocked database layer. They need a local MongoDB running and use a separate
`anonymous_test` database by default so they never touch your dev data:

```bash
npm run test
```

Set `TEST_MONGODB_URI` to point tests at a different MongoDB instance if needed.

## Deployment notes

Deployed on [Vercel](https://vercel.com). `@node-rs/argon2` is a native (compiled)
dependency, so it's listed under `serverExternalPackages` in `next.config.ts` to keep
Next.js from bundling it into the serverless function — bundling native addons can
corrupt the binary and crash the function at runtime.

### Security

- `next.config.ts` sets baseline security headers (CSP, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) on every route.
- All authenticated routes require a valid `Authorization: Bearer <token>` JWT signed
  with `JWT_SECRET`; there is no hardcoded fallback secret, so `JWT_SECRET` **must** be
  set in every environment or those routes will fail closed (500) rather than silently
  using a known key.
- **Rate limiting / abuse protection is handled at the platform level, not in app
  code.** Configure the following in the Vercel dashboard under
  Project → Security → Firewall:
  - Enable **Attack Challenge Mode** to auto-throttle traffic spikes.
  - Add rate-limit rules for `POST /api/auth/sign-in`, `POST /api/auth/sign-up`,
    `POST /api/auth/forgot-password`, and `POST /api/messages/[username]` — these are
    reachable with no authentication and are the endpoints most exposed to
    credential-stuffing or message-spam abuse.
