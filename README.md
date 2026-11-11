# Brasileirão Action Zones

See which Brasileirão Série A player leads each zone of the pitch for passes, shots and more.

> Work in progress: Sprint 1 (MVP). Full documentation arrives at the end of the sprint.

## Tech stack

- **Client:** React 19 + Vite 7 (`client/`)
- **Server:** Node.js 22 + Express 5 (`server/`)
- **Tooling:** npm workspaces, ESLint, Prettier, Vitest

## Getting started

Requirements: Node.js 20.19 or newer (22 recommended) and npm 10.

```bash
git clone https://github.com/gxrciafelipe/football-stats.git
cd football-stats
npm install
npm run dev
```

`npm run dev` starts both apps:

- Client: http://localhost:5173 (Vite proxies `/api` to the server)
- API: http://localhost:3001/api/health

## Scripts

| Command                | What it does                     |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start client and server together |
| `npm test`             | Run server and client tests      |
| `npm run lint`         | Lint all code with ESLint        |
| `npm run format:check` | Check formatting with Prettier   |
| `npm run build`        | Build the client for production  |
