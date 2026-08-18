# 🚀 Task Orchestrator & Distributed Worker Architecture

A full-stack, enterprise-grade task orchestration and monitoring platform built with **Next.js (App Router)**, **PostgreSQL (Prisma 7)**, **Redis (BullMQ)**, and **Nginx**. Containerized and orchestrated using **Docker Compose** with a fully automated **GitHub Actions CI/CD Pipeline**.

---

## 🏗️ System Architecture

```text
                       +-----------------------------+
                       |    Client Browser / HTTP    |
                       +--------------+--------------+
                                      |
                                      v (Port 80)
                       +--------------+--------------+
                       |   Nginx Reverse Proxy &     |
                       |       Rate Limiting         |
                       +--------------+--------------+
                                      |
                                      v (Internal Network)
                       +--------------+--------------+
                       |   Next.js Full-Stack App    |
                       | (App Router + Server Actions|
                       +-------+--------------+------+
                               |              |
              (Cache Queries)  |              |  (Push Background Jobs)
                               v              v
         +---------------------+----+    +----+------------------------+
         |       Redis Cache        |    |      Redis Task Queue       |
         |     (Cache-Aside)        |    |          (BullMQ)           |
         +--------------------------+    +--------------+--------------+
                                                        |
                                                        v (Consume Jobs)
                                         +--------------+--------------+
                                         |    Node.js Background       |
                                         |      Worker Process         |
                                         +--------------+--------------+
                                                        |
                                                        v (Persist Status)
                                         +--------------+--------------+
                                         |    PostgreSQL Database      |
                                         |         (Prisma 7)          |
                                         +-----------------------------+
```

---

## ⚡ Core Features & Engineering Highlights

- **Multi-Stage Docker Builds:** Optimized production container size using Next.js `standalone` output and non-root users.
- **Asynchronous Background Processing:** Decoupled long-running operations from HTTP requests via Redis queues and BullMQ workers.
- **Cache-Aside Invalidation:** Sub-millisecond response latency for recurring read operations with automatic cache eviction on mutations.
- **Edge Gateway & Security:** Nginx reverse proxy with gzip compression, request headers sanitization, and IP-based rate limiting (`10 req/sec`).
- **Prisma 7 ORM Integration:** Configured with modern TypeScript configuration (`prisma.config.ts`) and zero-downtime auto-migrations.
- **Observability & Diagnostics:** Live queue dashboard (Bull-Board) on dedicated port and diagnostic `/api/health` system probes.
- **CI/CD Automation:** GitHub Actions workflow verifying TypeScript compilation, ESLint rules, and Docker container builds on every PR.
- **Granular Git History:** Enforced Conventional Commits with Husky and Commitlint hooks alongside GitHub Flow branching.

---

## 🛠️ Tech Stack

| Layer               | Technology                                     |
| :------------------ | :--------------------------------------------- |
| **Framework**       | Next.js 15+ (React 19, App Router, TypeScript) |
| **Database & ORM**  | PostgreSQL 15, Prisma 7                        |
| **Queue & Caching** | Redis (ioredis, BullMQ)                        |
| **Reverse Proxy**   | Nginx Alpine                                   |
| **Monitoring**      | Bull-Board UI, Custom Healthcheck API          |
| **DevOps & CI**     | Docker, Docker Compose, GitHub Actions, Husky  |

---

## 🚦 Quick Start & Local Setup

### 1. Prerequisites

- [Docker Desktop](https://www.docker.com/) & Docker Compose
- Node.js 22+

### 2. Clone and Setup Environment

```bash
git clone [https://github.com/](https://github.com/)<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
cd <YOUR-REPO-NAME>
```

### 3. Spin up Containers

```bash
docker compose up --build -d
```

### 4. Available Endpoints

- **Web Application:** `http://localhost`
- **Queue Monitoring Dashboard:** `http://localhost:3001/admin/queues`
- **PgAdmin Database UI:** `http://localhost:5050` (`admin@admin.com` / `admin`)
- **System Health Diagnostics:** `http://localhost/api/health`

---

## 🧪 CI Verification & Quality Gates

Run local checks identical to the CI pipeline:

```bash
# Validate TypeScript compilation
npm run type-check

# Run Next.js Linter
npm run lint

# Verify container build integrity
docker compose build
```

---

## 🌿 Git Branching & Contribution Workflow

This repository follows **GitHub Flow**:

1. Branch out from `dev`: `git checkout -b feature/<feature-name>`
2. Follow Conventional Commits: `feat(scope): message` or `fix(scope): message`
3. Push and open a Pull Request targeting `dev`
4. Automated GitHub Actions CI executes build and type validation
5. Merge into `dev` and release to `main`
