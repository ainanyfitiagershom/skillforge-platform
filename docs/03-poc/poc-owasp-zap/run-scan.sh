#!/usr/bin/env bash
# POC OWASP ZAP - Audit securite OWASP Top 10 sur backend-app
#
# Approche :
#   1) Backend-app tourne sur localhost:8090 (via mvn spring-boot:run)
#   2) On cree un compte recruteur + on recupere un JWT
#   3) On telecharge la spec OpenAPI (/v3/api-docs) : 30 endpoints declares
#   4) ZAP importe l OpenAPI (couvre tous les endpoints, pas juste "/")
#   5) ZAP scan avec le JWT dans le header Authorization pour les endpoints
#      authentifies
#   6) Sortie : rapports HTML + JSON + Markdown
#
# Prerequis : backend-app up sur 8090, Docker daemon
#
# Usage : ./run-scan.sh [baseline|full]
#   baseline (defaut) : ~5 min, passif uniquement
#   full              : ~20-30 min, actif (envoie des payloads d attaque)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="$SCRIPT_DIR/reports"
STAMP="$(date -u +%Y-%m-%d_%H-%M-%S)"
MODE="${1:-baseline}"

TARGET_HOST="host.docker.internal"
TARGET_PORT="8090"
TARGET_URL="http://${TARGET_HOST}:${TARGET_PORT}"
LOCAL_TARGET_URL="http://localhost:${TARGET_PORT}"

ZAP_IMAGE="zaproxy/zap-stable"

mkdir -p "$REPORTS_DIR"

log() { echo "[ZAP $(date +%H:%M:%S)] $*"; }

# ---------------------------------------------------------------------------
# 1) Verifier backend-app
# ---------------------------------------------------------------------------
log "Verif backend-app ($LOCAL_TARGET_URL/actuator/health)…"
if ! curl -sf --max-time 5 "$LOCAL_TARGET_URL/actuator/health" > /dev/null; then
    echo "ERREUR : backend-app injoignable sur $LOCAL_TARGET_URL"
    echo "Demarrez : cd apps/backend-app && mvn -o -q -DskipTests spring-boot:run"
    exit 1
fi

# ---------------------------------------------------------------------------
# 2) Compte recruteur + JWT
# ---------------------------------------------------------------------------
ZAP_EMAIL="zap-audit@skillforge.local"
ZAP_PASSWORD="ZapAuditToken2026!"

log "Ensure compte recruteur $ZAP_EMAIL…"
curl -sf -X POST "$LOCAL_TARGET_URL/auth/register" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$ZAP_EMAIL\",\"password\":\"$ZAP_PASSWORD\",\"role\":\"RECRUTEUR\"}" \
    > /dev/null 2>&1 || log "  (compte existe deja, on continue)"

LOGIN_RESP=$(curl -sf -X POST "$LOCAL_TARGET_URL/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$ZAP_EMAIL\",\"password\":\"$ZAP_PASSWORD\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])")
[ -n "$ACCESS_TOKEN" ] || { echo "ERREUR JWT"; exit 1; }
log "JWT OK (${#ACCESS_TOKEN} chars)"

# ---------------------------------------------------------------------------
# 3) Telecharger la spec OpenAPI et la rendre accessible a ZAP
# ---------------------------------------------------------------------------
OPENAPI_FILE="$REPORTS_DIR/.openapi-${STAMP}.json"
curl -sf "$LOCAL_TARGET_URL/v3/api-docs" -o "$OPENAPI_FILE"
PATH_COUNT=$(python3 -c "import json; print(len(json.load(open('$OPENAPI_FILE'))['paths']))")
log "OpenAPI spec : $PATH_COUNT endpoints declares"

# Injecter le schema de securite bearerAuth + le mettre "obligatoire" sur tous
# les endpoints. Ainsi ZAP passera l'Authorization header quand il enverra
# les requetes decouvertes via OpenAPI.
python3 <<PYEOF
import json
p = "$OPENAPI_FILE"
d = json.load(open(p))
d.setdefault('components', {}).setdefault('securitySchemes', {})['bearerAuth'] = {
    'type': 'http', 'scheme': 'bearer', 'bearerFormat': 'JWT'
}
d['security'] = [{'bearerAuth': []}]
json.dump(d, open(p, 'w'))
PYEOF
log "OpenAPI enrichi avec securityScheme bearerAuth"

# ---------------------------------------------------------------------------
# 4) Preparer le context ZAP (avec header Authorization persistant)
# ---------------------------------------------------------------------------
# On utilise un script d automation ZAP YAML : c est la maniere moderne et
# supportee de scripter le behavior (contexts, jobs, reports).
AUTO_FILE="$REPORTS_DIR/.automation-${STAMP}.yaml"
cat > "$AUTO_FILE" <<EOF
env:
  contexts:
    - name: "skillforge-api"
      urls:
        - "${TARGET_URL}"
      includePaths:
        - "${TARGET_URL}.*"
      excludePaths:
        - "${TARGET_URL}/actuator/.*"
        - "${TARGET_URL}/v3/api-docs.*"
        - "${TARGET_URL}/swagger-ui.*"
  parameters:
    failOnError: false
    failOnWarning: false
    progressToStdout: true

jobs:
  # 1. Charger le header Authorization Bearer pour toutes les requetes.
  #    matchType=req_header : ajoute/remplace le header (idempotent).
  #    Note : ZAP baseline attend une seule regle unique par header.
  - type: replacer
    parameters:
      deleteAllRules: true
    rules:
      - description: "Inject JWT recruteur"
        url: ""
        matchType: "req_header"
        matchString: "Authorization"
        matchRegex: false
        replacementString: "Bearer ${ACCESS_TOKEN}"
        tokenProcessing: false
        initiators: []

  # 2. Importer la spec OpenAPI : ZAP decouvre les 30 endpoints
  - type: openapi
    parameters:
      apiFile: "/zap/wrk/.openapi-${STAMP}.json"
      targetUrl: "${TARGET_URL}"
      context: "skillforge-api"

  # 3. Requestor : visiter tous les endpoints connus (imports OpenAPI) pour
  #    generer du trafic HTTP que le passive scan analysera. Sans cela, ZAP
  #    connait 33 URLs mais ne les a jamais requetees, aucun header a analyser.
  - type: requestor
    parameters:
      user: ""
    requests:
      - url: "${TARGET_URL}/actuator/health"
        method: GET
      - url: "${TARGET_URL}/actuator/info"
        method: GET
      - url: "${TARGET_URL}/v3/api-docs"
        method: GET
      - url: "${TARGET_URL}/questions"
        method: GET
      - url: "${TARGET_URL}/tests"
        method: POST
      - url: "${TARGET_URL}/analytics/kpis"
        method: GET
      - url: "${TARGET_URL}/analytics/scores-distribution"
        method: GET
      - url: "${TARGET_URL}/analytics/questions-stats"
        method: GET
      - url: "${TARGET_URL}/analytics/skills-avg"
        method: GET
      - url: "${TARGET_URL}/analytics/recent-candidates"
        method: GET
      - url: "${TARGET_URL}/analytics/export/candidates.csv"
        method: GET
      - url: "${TARGET_URL}/analytics/export/questions-stats.csv"
        method: GET
      - url: "${TARGET_URL}/auth/login"
        method: POST
        data: '{"email":"test@t.io","password":"WrongPassword123!"}'
      - url: "${TARGET_URL}/candidate/passations/00000000-0000-0000-0000-000000000000/state"
        method: GET
      - url: "${TARGET_URL}/rgpd/purge-expired-cvs"
        method: POST
      - url: "${TARGET_URL}/nonexistent-endpoint"
        method: GET

  # 4. Spider passif : complement sur les liens statiques
  - type: spider
    parameters:
      context: "skillforge-api"
      maxDuration: 3
      maxDepth: 3

  # 5. Attendre que les scans passifs aient fini de tourner sur toutes les URLs
  #    (le baseline scan repose sur les rules passives : CSP manquant, headers HTTP, cookies, ...)
  - type: passiveScan-wait
    parameters:
      maxDuration: 5

EOF

# Ajouter le job actif seulement en mode full
if [ "$MODE" = "full" ]; then
cat >> "$AUTO_FILE" <<EOF
  # 4a. Active scan (SQLi, XSS, path traversal, command injection, ...)
  - type: activeScan
    parameters:
      context: "skillforge-api"
      maxRuleDurationInMins: 3
      maxScanDurationInMins: 25
      policy: "Default Policy"

EOF
fi

cat >> "$AUTO_FILE" <<EOF
  # Reports
  - type: report
    parameters:
      template: "traditional-html"
      reportDir: "/zap/wrk"
      reportFile: "${MODE}-${STAMP}.html"
      reportTitle: "SkillForge - Audit OWASP ZAP - ${MODE^^} - ${STAMP}"
  - type: report
    parameters:
      template: "traditional-json"
      reportDir: "/zap/wrk"
      reportFile: "${MODE}-${STAMP}.json"
  - type: report
    parameters:
      template: "traditional-md"
      reportDir: "/zap/wrk"
      reportFile: "${MODE}-${STAMP}.md"
EOF

log "Automation plan : $AUTO_FILE"

# ---------------------------------------------------------------------------
# 5) Lancer ZAP avec le plan d automation
# ---------------------------------------------------------------------------
log "=== Lancement scan $MODE (~$([ "$MODE" = "full" ] && echo "25-30 min" || echo "5 min")) ==="
docker run --rm \
    --add-host=host.docker.internal:host-gateway \
    -v "$REPORTS_DIR:/zap/wrk:rw" \
    "$ZAP_IMAGE" \
    zap.sh -cmd -autorun "/zap/wrk/.automation-${STAMP}.yaml" \
    || log "  (ZAP a retourne non-zero, verifiez le rapport)"

log "Termine. Rapports :"
ls -1 "$REPORTS_DIR"/${MODE}-${STAMP}.* 2>/dev/null

# Cleanup fichiers intermediaires
rm -f "$OPENAPI_FILE" "$AUTO_FILE"
