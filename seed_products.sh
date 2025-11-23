#!/usr/bin/env bash
set -euo pipefail

URL="http://localhost:3000/product"

# Lista de nomes para randomizar
NOMES=(
  "Notebook"
  "Ultrabook"
  "PC Gamer"
  "Monitor"
  "Teclado Mecânico"
  "Mouse Gamer"
  "Headset"
  "SSD NVMe"
  "HD Externo"
  "Placa de Vídeo"
  "Processador"
  "Memória RAM"
  "Placa-Mãe"
  "Fonte ATX"
  "Webcam"
  "Microfone"
  "Cadeira Gamer"
  "Tablet"
  "Smartphone"
  "Roteador"
  "Switch Gigabit"
  "Fone Bluetooth"
  "Impressora"
  "Scanner"
  "TV 43"
  "TV 55"
  "Mini PC"
  "All-in-One"
  "Workstation"
  "Chromebook"
)

TOTAL=30
echo "Iniciando inclusão de $TOTAL produtos..."
echo

for i in $(seq 1 $TOTAL); do
  # sorteia nome
  INDEX=$((RANDOM % ${#NOMES[@]}))
  NAME="${NOMES[$INDEX]}"

  # gera preço entre 1000 e 3999 com centavos (ponto como separador)
  INT_PART=$((1000 + RANDOM % 3000))   # 1000..3999
  CENTS=$((RANDOM % 100))              # 0..99
  PRICE=$(printf "%d.%02d" "$INT_PART" "$CENTS")  # ex: 1994.07

  # monta JSON numa única linha (evita quebras e problemas de parsing)
  JSON=$(printf '{"name":"%s","price":%s}' "$NAME" "$PRICE")

  echo "[$i] Enviando: $NAME - R$ $PRICE"
  # envia e mostra resposta curta (código + body). retire --silent se quiser ver headers também.
  HTTP_RESPONSE=$(curl --write-out "HTTPSTATUS:%{http_code}" --silent --location "$URL" \
    --header 'Content-Type: application/json' \
    --data-raw "$JSON")

  # separa body e status
  HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed -e 's/HTTPSTATUS\:.*//g')
  HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

  echo "Status: $HTTP_STATUS"
  echo "Body: $HTTP_BODY"
  echo "---------------------------------------"

  # opcional: pequeno delay para não sobrecarregar
  sleep 0.05
done

echo "Finalizado!"
