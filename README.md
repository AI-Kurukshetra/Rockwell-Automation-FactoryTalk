# Industrial Automation Command Center

Modern equipment monitoring dashboard built with Next.js (App Router), Supabase
Postgres, and Tailwind + shadcn/ui. Auth uses Supabase email/password with
per-user RLS. CRUD is implemented with server actions and route handlers.

## Requirements

- Node.js 20+
- Supabase project (URL + anon key)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Create schema and RLS in Supabase:

- Run `supabase/schema.sql` in the Supabase SQL Editor.

4. (Optional) Seed demo data:

- Replace the placeholder user id in `supabase/seed.sql` with a real
  `auth.users.id`.
- Run the seed SQL in Supabase.

5. Start the dev server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start dev server
- `npm run build` - build for production
- `npm run start` - run production server
- `npm run lint` - lint codebase
- `npm run lint:fix` - autofix lint issues
- `npm run format` - format codebase

## Deployment (Vercel)

Deploy with Vercel and add the same environment variables in the Vercel project
settings. Supabase handles the database and auth.
