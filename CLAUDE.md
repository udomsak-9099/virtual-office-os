# Virtual Office OS

## Project Overview
Virtual Office OS เป็น SaaS platform สำหรับบริษัทตั้งใหม่ที่ต้องการระบบบริหารองค์กรแบบดิจิทัลครบจบในที่เดียว รวมการสื่อสาร งาน เอกสาร การอนุมัติ HR การเงิน ความรู้ และ AI assistant

## Business Model
- SaaS: per user per month
- Target: บริษัทตั้งใหม่ขนาดเล็ก-กลาง (3-100+ คน)
- AI-first organization model: 3 คนจริง + AI agents ทำหน้าที่เป็น digital workforce

## Tech Stack
- **Monorepo**: pnpm workspaces
- **Backend**: NestJS (TypeScript) — modular monolith
- **Frontend**: Next.js 14+ (App Router)
- **Mobile**: React Native (Expo)
- **Database**: PostgreSQL (primary), Redis (cache/queue)
- **Search**: OpenSearch
- **Storage**: S3-compatible object storage
- **AI**: Centralized AI Gateway + RAG pipeline
- **Infra**: Docker, CI/CD via GitHub Actions

## Architecture Principles
1. Start as modular monolith, split services only when justified
2. Domain-driven module separation
3. Event-driven workflows for automation
4. API-first design (REST + WebSocket)
5. Zero-trust security — backend-enforced permissions always
6. Human-in-the-loop for high-risk AI actions
7. Audit everything important

## Module Structure (Backend)
Core platform modules first, then business domains:
1. Identity & Access (auth, users, roles, permissions)
2. Notifications
3. Search
4. Audit & Activity
5. Workflow Engine
6. Dashboard
7. Chat & Collaboration
8. Meetings
9. Tasks
10. Projects
11. Documents
12. Approvals
13. Sales, Marketing, Operations, Procurement
14. Finance, HR, Legal/Compliance
15. AI Workspace
16. BI/Reporting

## Key Conventions
- UUID primary keys everywhere
- snake_case for DB columns, camelCase for TypeScript
- All timestamps in UTC (ISO 8601)
- Soft delete with is_deleted + deleted_at
- Standard columns: id, org_id, created_at, updated_at, created_by, updated_by
- API versioned under /api/v1
- Permission codes: MODULE_ACTION_SCOPE (e.g., TASK_VIEW_DEPT)

## MVP Scope (Phase 1)
1. Auth + Roles + Permissions
2. Home Dashboard
3. Tasks
4. Meetings
5. Documents
6. Approvals + Workflow Engine
7. AI Summary + Search
8. Notifications
9. Chat (basic)

## Commands
- `pnpm install` — install all dependencies
- `pnpm dev:api` — start backend dev server
- `pnpm dev:web` — start frontend dev server
- `pnpm db:migrate` — run database migrations
- `pnpm db:seed` — seed initial data
- `pnpm test` — run all tests
- `pnpm lint` — lint all packages
