# CartiTracker Monorepo

CartiTracker has been migrated to a Turborepo monorepo structure for better scalability and code sharing.

## Project Structure

```
├── apps/
│   └── web/                 # Next.js web application (main app)
├── packages/
│   ├── ui/                  # Shared UI components
│   └── config/              # Shared configuration
├── turbo.json               # Turborepo configuration
└── package.json             # Root package.json with workspaces
```

## Apps

- **`web`**: The main CartiTracker Next.js application

## Packages

- **`@carti-tracker/ui`**: Shared UI components library
- **`@carti-tracker/config`**: Shared configuration and tooling

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies for all workspaces
npm install
```

### Development

```bash
# Run development server for all apps
npm run dev

# Run development server for specific app
npm run dev --workspace=@carti-tracker/web
```

### Building

```bash
# Build all apps and packages
npm run build

# Build specific app
npm run build --workspace=@carti-tracker/web
```

### Linting and Formatting

```bash
# Lint all workspaces
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format:write

# Check formatting
npm run format:check
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run e2e
```

### Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Run database migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## Turborepo

This monorepo uses [Turborepo](https://turbo.build/repo) for:

- **Fast builds**: Incremental builds and intelligent caching
- **Task pipelines**: Parallel execution with dependency awareness
- **Remote caching**: Share build artifacts across team and CI

### Turborepo Features

- **Parallel execution**: Tasks run in parallel when possible
- **Dependency-aware**: Respects task dependencies across packages
- **Incremental builds**: Only rebuilds what changed
- **Caching**: Local and remote caching for faster subsequent runs

## Adding New Apps

1. Create new app in `apps/` directory
2. Add workspace to root `package.json`
3. Add app-specific scripts to `turbo.json` if needed

## Adding New Packages

1. Create new package in `packages/` directory
2. Add package.json with appropriate scripts
3. Export functionality from package index file
4. Import in apps as needed using workspace syntax

## Migration Notes

The following changes were made during the Turborepo migration:

- Moved main application to `apps/web/`
- Created shared packages structure
- Updated build and development scripts to use Turbo
- Maintained all existing functionality and dependencies
- Added workspace configuration for dependency management

## Contributing

When contributing to this monorepo:

1. Follow the established workspace structure
2. Use shared packages for reusable code
3. Run linting and tests before submitting PRs
4. Update this README when adding new apps or packages

## Overview

CartiTracker is a Playboi Carti leaks song tracker. It is a web application that allows users to track and listen to Playboi Carti leaks.

## Screenshots

![CartiTracker](https://github.com/user-attachments/assets/ca4dbfdd-cea4-473a-b591-05709fb16be2)

## Built with

[![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ShadcnUI](https://img.shields.io/badge/shadcn%2Fui-000?style=for-the-badge&logo=shadcnui&logoColor=fff)](https://ui.shadcn.com/)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
