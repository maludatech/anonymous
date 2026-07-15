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
| `DESCRIPTION`          | No       | Overrides the app description text.                        |

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
| `npm run email`  | Preview email templates with React Email's dev server. |

## Deployment notes

Deployed on [Vercel](https://vercel.com). `@node-rs/argon2` is a native (compiled)
dependency, so it's listed under `serverExternalPackages` in `next.config.ts` to keep
Next.js from bundling it into the serverless function — bundling native addons can
corrupt the binary and crash the function at runtime.
