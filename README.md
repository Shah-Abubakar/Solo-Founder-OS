# Solo Founder OS

Local-first AI agent orchestration platform for solo founders. Built with Next.js 14, Express, and SQLite.

## Architecture

```
solo-founder-os/
├── src/              # Next.js 14 frontend + API routes
├── backend/          # Standalone Express backend server
├── scripts/          # Database setup and utilities
└── public/           # Static assets
```

## Getting Started

```bash
# Install frontend dependencies
npm install

# Setup SQLite database
npm run setup-db

# Start the frontend dev server
npm run dev

# In another terminal, start the backend
cd backend && npm install && npm run dev
```

## Features

- **Dashboard** — real-time overview of agent activity and pending tasks
- **Agent Chat** — multi-model chat with OpenAI, Anthropic, and Ollama
- **Task Board** — manage and track agent task execution
- **Settings** — configure AI providers, agent preferences, and system options
- **Agent Orchestrator** — coordinate multiple AI agents for complex workflows
- **Local-first** — all data stored in SQLite, no cloud dependency

## Packaging

Use `pkg` to build standalone desktop executables for Windows, macOS, and Linux.
