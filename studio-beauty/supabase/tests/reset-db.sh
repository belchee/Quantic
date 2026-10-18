#!/usr/bin/env bash
# Recreates the test database and applies bootstrap + all migrations.
# Usage: DATABASE_URL=postgres://postgres:postgres@localhost:5432/studio_beauty_test ./reset-db.sh
set -euo pipefail
cd "$(dirname "$0")/.."
URL="${DATABASE_URL:-postgres://postgres:postgres@localhost:5432/studio_beauty_test}"
DB="${URL##*/}"
ADMIN="${URL%/*}/postgres"
psql "$ADMIN" -q -v ON_ERROR_STOP=1 -c "drop database if exists $DB with (force)" -c "create database $DB"
psql "$URL" -q -v ON_ERROR_STOP=1 -f tests/bootstrap.sql 2>&1 | grep -v -E 'wal_level|HINT' || true
for f in migrations/*.sql; do psql "$URL" -q -v ON_ERROR_STOP=1 -f "$f"; done
echo "Database $DB ready."
