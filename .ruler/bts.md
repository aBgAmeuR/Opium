# Better-T-Stack Project Rules

This is an opium project.

## Project Structure

This is a Turborepo monorepo with the following structure:

- **`apps/web/`** - Frontend application
- **`apps/server/`** - Backend server (Elysia)
- **`packages/api/`** - Shared API logic and types
- **`packages/auth/`** - Authentication logic and utilities
- **`packages/db/`** - Database schema and utilities (Drizzle ORM)
- **`packages/email/`** - Email-related utilities
- **`packages/icons/`** - Icon set/package
- **`packages/storage/`** - Storage utilities
- **`packages/ui/`** - Shared UI components

## Available Scripts (root)

- `bun run dev` - Run `turbo dev` across workspaces (starts dev tasks that exist)
- `bun run build` - Generate DB types then build all workspaces
- `bun run preview` - Run `turbo preview`
- `bun run db:push` - Run Drizzle push in `@opium/db`
- `bun run db:studio` - Open Drizzle Studio for `@opium/db`
- `bun run db:generate` - Run Drizzle generate in `@opium/db`
- `bun run db:migrate` - Run Drizzle migrate in `@opium/db`

## Database (Drizzle ORM)

All database operations are managed in the `@opium/db` workspace (Drizzle ORM). From the repository root, use the provided scripts which target `@opium/db` via Turbo:

- `bun run db:push` - Push schema changes to the database
- `bun run db:studio` - Open Drizzle Studio
- `bun run db:generate` - Generate Drizzle artifacts
- `bun run db:migrate` - Run database migrations

Configuration: `packages/db/drizzle.config.ts`

Schemas: `packages/db/src/schema/`

## API Structure

- oRPC endpoints are in `apps/server/src/api/`
- Client-side API utils are in `apps/web/src/utils/orpc.ts`

## Authentication

Authentication is enabled in this project:

- Server-side auth utilities are in `packages/auth`
- Web app auth client is in `apps/web/src/lib/auth-client.ts`

## Adding More Features

You can add additional addons or deployment options to your project using:

```bash
bunx create-better-t-stack
add
```

Available addons you can add:

- **Documentation**: Starlight, Fumadocs
- **Linting**: Biome, Oxlint, Ultracite
- **Other**: Ruler, Turborepo, PWA, Tauri, Husky

You can also add web deployment configurations like Cloudflare Workers support.

## Project Configuration

This project includes a `bts.jsonc` configuration file that stores your Better-T-Stack settings:

- Contains your selected stack configuration (database, ORM, backend, frontend, etc.)
- Used by the CLI to understand your project structure
- Safe to delete if not needed
- Updated automatically when using the `add` command

## Key Points

- This is a Turborepo monorepo using Bun workspaces
- Workspaces are defined under `apps/*`, `packages/*`, and `tooling/*`
- Each workspace has its own `package.json` and dependencies
- Run commands from the root to execute across all workspaces
- Turborepo handles build caching and parallel execution
