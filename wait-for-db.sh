#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."

until PGPASSWORD=${POSTGRES_PASSWORD:-postgres} psql -h postgres -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-aircraft_monitoring} -c '\q' 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing command"
exec "$@"

