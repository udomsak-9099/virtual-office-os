#!/bin/bash
# Virtual Office OS — Development Start Script

set -e

export PATH="/Applications/Docker.app/Contents/Resources/bin:/usr/local/bin:$PATH"
export DATABASE_URL="postgresql://vos:vos_dev@localhost:5432/virtual_office_os"

cd "$(dirname "$0")/.."

echo "=== Virtual Office OS Dev Environment ==="

# 1. Start Docker services
echo "Starting PostgreSQL and Redis..."
docker compose up -d postgres redis 2>/dev/null

sleep 2

# 2. Push schema if needed
echo "Syncing database schema..."
npx prisma db push --schema=packages/database/prisma/schema.prisma --skip-generate 2>/dev/null

# 3. Build API
echo "Building API..."
npx nest build --path apps/api/tsconfig.json

# 4. Start API in background
echo "Starting API server on port 3001..."
DATABASE_URL="$DATABASE_URL" JWT_SECRET="vos-dev-secret-key-change-in-production" node apps/api/dist/main.js &
API_PID=$!

sleep 2

# 5. Start frontend
echo "Starting frontend on port 3000..."
npm run dev --workspace=apps/web &
WEB_PID=$!

echo ""
echo "=== Ready! ==="
echo "  Frontend: http://localhost:3000"
echo "  API:      http://localhost:3001"
echo "  API Docs: http://localhost:3001/api/docs"
echo ""
echo "  Demo accounts:"
echo "    CEO:     ceo@demo.com     / demo1234"
echo "    Ops:     ops@demo.com     / demo1234"
echo "    Finance: finance@demo.com / demo1234"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for either to exit
trap "kill $API_PID $WEB_PID 2>/dev/null; exit" INT TERM
wait
