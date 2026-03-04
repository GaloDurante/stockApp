# StockApp

StockApp is a web application to manage inventory and sales operations for a small business. It includes product control, sales records, purchases, cash/account movements, and business reports.

## What this project does

- Manages products (create, edit, stock updates, categories, prices).
- Registers sales with items, payment methods, receivers, and status.
- Registers purchases/inventory entries.
- Tracks account movements (`Ingreso` / `Gasto`) by receiver.
- Provides reports for profits, investments, and top products.
- Protects admin routes with credential-based authentication.

## Tech stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth (Credentials provider)
- Tailwind CSS 4

## Main routes

- `/login`: authentication screen
- `/admin/sales`: sales list and management
- `/admin/products`: product list and management
- `/admin/wallet`: account movements
- `/admin/reports`: business reports

## Prerequisites

Install these tools on your machine:

- Node.js 20+
- npm 10+
- PostgreSQL database (local or cloud)

## Environment variables

Create a `.env` file in the project root with:

```env
NEXTAUTH_SECRET="your_random_secret"
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Notes:

- `DATABASE_URL` is used by Prisma Client.
- `DIRECT_URL` is used by Prisma for direct DB operations.
- `NEXTAUTH_SECRET` must be a long random value.

To generate a secure secret you can run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Commands required before using the app

Run these commands once after cloning and after setting `.env`:

```bash
npm install
npx prisma generate
npx prisma db push
```

Why this is required:

- `npm install` installs dependencies.
- `prisma generate` creates the Prisma client in `src/generated/prisma`.
- `prisma db push` creates/updates database tables from `prisma/schema.prisma`.

## Run locally

Start the development server:

```bash
npm run dev
```

Then open:

- `http://localhost:3000` (redirects to login)

## Create the first user (required to log in)

This project does not include a public registration flow, so create a user manually:

```bash
node -e "const bcrypt=require('bcrypt'); const {PrismaClient}=require('./src/generated/prisma'); (async()=>{const prisma=new PrismaClient(); const password=await bcrypt.hash('admin12345',10); await prisma.user.create({data:{username:'admin',password}}); await prisma.$disconnect(); console.log('User created');})();"
```

Then log in with:

- username: `admin`
- password: `admin12345`

Change the password immediately in your own workflow.

## Available npm scripts

- `npm run dev`: start development server (Turbopack)
- `npm run build`: generate Prisma client and build production app
- `npm run start`: run production build
- `npm run lint`: run ESLint

## Production notes

- Use strong secrets and never commit real credentials in `.env`.
- Run `npm run build` before deploying.
- Ensure database connectivity from your hosting environment.

## Project structure (high level)

- `src/app`: Next.js routes/pages
- `src/components`: UI and feature components
- `src/lib/actions`: server actions
- `src/lib/services`: database/service layer
- `prisma/schema.prisma`: data models
- `src/generated/prisma`: generated Prisma client
