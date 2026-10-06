#!/usr/bin/env bash
# Dev bootstrap: creates a user + device in the LOCAL api and prints the device API key.
# Idempotent — safe to re-run (reuses the user/device if they already exist).
#
#   1. docker compose up -d && cd api && pnpm db:seed     (content: levels, modules, lessons)
#   2. pnpm dev                                           (api on :3333, in another terminal)
#   3. bash scripts/dev-bootstrap.sh
#
# Then put the printed LERY_DEVICE_API_KEY in core/.env AND agent/.env (and the Pi's core/.env)
# and restart the agent and the core — neither re-reads .env while running.
set -euo pipefail

API="${LERY_API_URL:-http://localhost:3333}"
USERNAME="${LERY_DEV_USERNAME:-lery-dev}"
EMAIL="${LERY_DEV_EMAIL:-dev@lery.local}"
PASSWORD="${LERY_DEV_PASSWORD:-lery-dev-123}"
SERIAL="${LERY_DEV_SERIAL:-lery-dev-device}"

json_get() { python3 -c "import sys,json; print(json.load(sys.stdin)['$1'])"; }
post() { # post <path> <json> [token]
  curl -sS -X POST "$API$1" -H 'Content-Type: application/json' \
    ${3:+-H "Authorization: Bearer $3"} -d "$2" -w '\n%{http_code}'
}

if ! curl -sS -o /dev/null "$API/docs" 2>/dev/null; then
  echo "API not reachable at $API — run 'pnpm dev' in api/ first." >&2
  exit 1
fi

# 1. user (400 = already exists, fine)
out=$(post /auth/users "{\"name\":\"Lery Dev\",\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
code=${out##*$'\n'}
[[ "$code" == 201 || "$code" == 400 ]] || { echo "create user failed ($code): ${out%$'\n'*}" >&2; exit 1; }

# 2. login
out=$(post /auth/sessions/password "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")
code=${out##*$'\n'}
[[ "$code" == 201 || "$code" == 200 ]] || { echo "login failed ($code): ${out%$'\n'*}" >&2; exit 1; }
TOKEN=$(echo "${out%$'\n'*}" | json_get token)

# 3. device (400 = serial already exists, fine) + register -> api key
post /devices "{\"serialNumber\":\"$SERIAL\",\"nickname\":\"Dev device\"}" "$TOKEN" >/dev/null || true
out=$(post /devices/register "{\"serialNumber\":\"$SERIAL\"}" "$TOKEN")
code=${out##*$'\n'}
[[ "$code" == 200 ]] || { echo "register failed ($code): ${out%$'\n'*}" >&2; exit 1; }
KEY=$(echo "${out%$'\n'*}" | json_get apiKey)

echo
echo "Done. Put this line in core/.env and agent/.env (and the Pi's core/.env):"
echo
echo "LERY_DEVICE_API_KEY=$KEY"
