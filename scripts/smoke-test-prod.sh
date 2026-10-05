#!/usr/bin/env bash
# Smoke tests SkillForge en production (Render + Supabase)
# Verifie que les endpoints critiques repondent correctement apres un deploy.
#
# Usage : bash scripts/smoke-test-prod.sh

set -u

BASE_URL="${BASE_URL:-https://skillforge-api-xde0.onrender.com}"
PASS=0
FAIL=0

check_code() {
  local label="$1"
  local expected="$2"
  local code="$3"

  if [ "$code" = "$expected" ]; then
    echo "  OK    $label ($code)"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  $label (attendu $expected, recu $code)"
    FAIL=$((FAIL + 1))
  fi
}

echo
echo "===== Smoke tests SkillForge production ====="
echo "Base URL : $BASE_URL"
echo

echo "[1/8] Health check"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/actuator/health")
check_code "GET  /actuator/health" "200" "$code"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/actuator/info")
check_code "GET  /actuator/info" "200" "$code"

echo
echo "[2/8] OpenAPI / Swagger"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/v3/api-docs")
check_code "GET  /v3/api-docs" "200" "$code"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/swagger-ui/index.html")
check_code "GET  /swagger-ui/index.html" "200" "$code"

echo
echo "[3/8] Login avec mauvais credentials (JSON valide, 401 attendu)"
code=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"inexistant@skillforge.local","password":"wrong-password"}')
check_code "POST /auth/login (401 Unauthorized attendu)" "401" "$code"

echo
echo "[4/8] Endpoints proteges sans JWT (403 Forbidden attendu)"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/tests")
check_code "GET  /tests sans JWT" "403" "$code"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/review")
check_code "GET  /review sans JWT" "403" "$code"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/questions")
check_code "GET  /questions sans JWT" "403" "$code"

echo
echo "===== Resume ====="
echo "  Reussis : $PASS"
echo "  Echoues : $FAIL"
echo

if [ "$FAIL" -eq 0 ]; then
  echo "Toutes les verifications sont passees."
  exit 0
else
  echo "Au moins une verification a echoue."
  exit 1
fi
