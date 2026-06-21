#!/bin/sh
# Wait for the database, push the Prisma schema (creates tables incl.
# notifications + the blocked column), then start the app.
set -e

echo "⏳ Syncing Prisma schema to the database..."
until npx prisma db push --skip-generate; do
  echo "   Database not ready yet — retrying in 5s..."
  sleep 5
done

echo "✅ Database schema in sync."
exec "$@"
