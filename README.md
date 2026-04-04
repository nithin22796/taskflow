# TaskFlow

A real-time project management application built with a GraphQL-first architecture.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Apollo Client, GraphQL Codegen |
| Backend | Node.js, Apollo Server 4, TypeScript |
| Database | PostgreSQL (Docker), Prisma ORM |
| Auth | JWT (access + refresh tokens) |
| Real-time | GraphQL Subscriptions |
| Performance | DataLoader |
| DevOps | Docker, Docker Compose |

## Project Structure

```
taskflow/
  client/       # React + TypeScript frontend
  server/       # Node.js + Apollo Server backend
  docker-compose.yml
  .env
```

## Getting Started

### Prerequisites
- Node.js v18+
- pnpm
- Docker Desktop

### Setup

1. Clone the repo and copy the example env file:
```bash
cp .env.example .env
```

2. Start the database:
```bash
docker-compose up -d
```

3. Install server dependencies and run migrations:
```bash
cd server
pnpm install
pnpm prisma migrate dev
```

4. Install client dependencies:
```bash
cd client
pnpm install
```

### Running the app

```bash
# Start backend (from server/)
pnpm dev

# Start frontend (from client/)
pnpm dev
```

- Frontend: http://localhost:5173
- GraphQL Playground: http://localhost:4000/graphql

## Features

*Updated as features are built.*
