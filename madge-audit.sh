#!/usr/bin/env bash
# madge-audit.sh
# Mini-auditoria de dependências para projetos TS (Madge + checks úteis para Clean Architecture)
# Saídas: graph.svg, cycles.txt, orphans.txt, infra-violations.txt, madge-report.json

set -o errexit
set -o pipefail

ROOT_DIR="$(pwd)"
SRC_DIR="src"
TSCONFIG="tsconfig.json"
MADGE_TSCONFIG="tsconfig.madge.json"
OUT_DIR="madge-audit-output"

mkdir -p "$OUT_DIR"
cd "$ROOT_DIR"

echo "[1/7] checando node/npm..."
if ! command -v node >/dev/null 2>&1; then
  echo "node não encontrado. Instale Node.js (recomendo nvm)." >&2
  exit 1
fi

# 1) Validar tsconfig com tsc (se existir tsc no projeto usa npx)
echo "[2/7] validando tsconfig com tsc (se disponível)..."
if command -v npx >/dev/null 2>&1; then
  if npx -s tsc --showConfig -p "$TSCONFIG" >/dev/null 2>&1; then
    echo "tsconfig válido para tsc." 
  else
    echo "aviso: tsconfig.json não pôde ser processado pelo tsc. Vou gerar tsconfig.madge.json mínimo e usar com madge." >&2
    cat > "$MADGE_TSCONFIG" <<EOF
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "baseUrl": ".",
    "paths": {}
  },
  "include": ["$SRC_DIR"]
}
EOF
  fi
else
  echo "npx não disponível — continuando e usando tsconfig.madge.json mínimo." >&2
  cat > "$MADGE_TSCONFIG" <<EOF
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "baseUrl": ".",
    "paths": {}
  },
  "include": ["$SRC_DIR"]
}
EOF
fi

# 2) Gerar grafo (SVG) via madge (usa tsconfig.madge.json se tsconfig original causar erro)
echo "[3/7] gerando grafo de dependências (graph.svg) e JSON..."
MADGE_CMD=(npx madge --extensions ts,tsx,js,jsx "$SRC_DIR" --json)

# tentativa com tsconfig original primeiro (se existe e npx tsc validou)
USE_TSCONFIG="$TSCONFIG"
if [ -f "$MADGE_TSCONFIG" ]; then
  # se criamos tsconfig.madge.json, use ele
  USE_TSCONFIG="$MADGE_TSCONFIG"
fi

# gerar json e svg; capturar erro e tentar sem tsconfig se falhar
set +o errexit
MADGE_JSON_OUTPUT="$OUT_DIR/madge-report.json"
MADGE_SVG_OUTPUT="$OUT_DIR/graph.svg"

if npx madge --ts-config="$USE_TSCONFIG" --image "$MADGE_SVG_OUTPUT" "$SRC_DIR" --json > "$MADGE_JSON_OUTPUT" 2> "$OUT_DIR/madge.log"; then
  echo "grafo gerado: $MADGE_SVG_OUTPUT"
else
  echo "madge falhou com tsconfig; tentando sem --ts-config (parsing por extensão)..." >&2
  if npx madge --extensions ts,tsx,js,jsx "$SRC_DIR" --image "$MADGE_SVG_OUTPUT" --json > "$MADGE_JSON_OUTPUT" 2>> "$OUT_DIR/madge.log"; then
    echo "grafo gerado (modo fallback): $MADGE_SVG_OUTPUT"
  else
    echo "erro: madge não conseguiu gerar o grafo. Veja $OUT_DIR/madge.log" >&2
  fi
fi
set -o errexit

# 3) detectar ciclos
echo "[4/7] detectando ciclos..."
if npx madge --ts-config="$USE_TSCONFIG" "$SRC_DIR" --circular > "$OUT_DIR/cycles.txt" 2>> "$OUT_DIR/madge.log"; then
  echo "ciclos verificados — veja $OUT_DIR/cycles.txt"
else
  echo "tentando detectar ciclos sem tsconfig..." >&2
  npx madge "$SRC_DIR" --circular > "$OUT_DIR/cycles.txt" 2>> "$OUT_DIR/madge.log" || true
fi

# 4) detectar órfãos
echo "[5/7] detectando módulos órfãos..."
npx madge --ts-config="$USE_TSCONFIG" "$SRC_DIR" --orphans > "$OUT_DIR/orphans.txt" 2>> "$OUT_DIR/madge.log" || true

# 5) relatório madge JSON já gerado ($MADGE_JSON_OUTPUT)
if [ -f "$MADGE_JSON_OUTPUT" ]; then
  echo "[6/7] resumo madge JSON salvo em $MADGE_JSON_OUTPUT"
fi

# 6) checagem específica para Clean Architecture — imports do núcleo apontando para infra
# procura imports de 'src/infrastructure' dentro de src/domain ou src/application
echo "[7/7] procurando violações domain/application -> infrastructure..."
VIOLATIONS_FILE="$OUT_DIR/infra-violations.txt"
rg "from ['\"](.*infrastructure).*['\"]|require\(['\"](.*infrastructure).*['\"]\)" --hidden --glob '!node_modules' "$SRC_DIR/domain" "$SRC_DIR/application" > "$VIOLATIONS_FILE" || true

# Também checa ocorrências genéricas que mencionam 'src/infrastructure' em todo o código
rg "src[/\\]infrastructure" --hidden --glob '!node_modules' "$SRC_DIR" > "$OUT_DIR/_all-infra-refs.txt" || true

# resumo final
cat <<EOF

AUDIT COMPLETE — arquivos gerados em: $OUT_DIR
- Grafo (SVG): $MADGE_SVG_OUTPUT
- Madge JSON: $MADGE_JSON_OUTPUT
- Ciclos: $OUT_DIR/cycles.txt
- Órfãos: $OUT_DIR/orphans.txt
- Violações domain->infra (grep): $VIOLATIONS_FILE
- Log madge: $OUT_DIR/madge.log

Interpretação rápida:
- "cycles.txt" não vazio -> há ciclos (precisa refatorar)
- "infra-violations.txt" não vazio -> arquivos em domain/application importam infra (viola Dependency Rule)
- "orphans.txt" lista módulos não referenciados (possível código morto)

EOF

exit 0
