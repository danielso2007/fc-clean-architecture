#!/usr/bin/env bash
set -euo pipefail

URL="http://localhost:3000/customer"

# Lista de possíveis nomes
NOMES=(
  "Oliveira"
  "Costa"
  "Souza"
  "Mendes"
  "Lima"
  "Pereira"
  "Santos"
  "Barros"
  "Gonçalves"
  "Ferreira"
  "Carvalho"
  "Almeida"
  "Cardoso"
  "Moraes"
  "Azevedo"
  "Monteiro"
  "Martins"
  "Campos"
  "Silveira"
  "Ribeiro"
)

# Ruas possíveis
RUAS=(
  "Maria Leopoldina"
  "Rua das Flores"
  "Avenida Central"
  "Rua 7 de Setembro"
  "Travessa das Palmeiras"
  "Alameda Santos"
  "Rua Projetada"
  "Rua Vitória Régia"
  "Avenida Brasil"
  "Rua Dom Pedro II"
)

# Cidades possíveis
CIDADES=(
  "Niterói"
  "Rio de Janeiro"
  "São Paulo"
  "Belo Horizonte"
  "Curitiba"
  "Porto Alegre"
  "Fortaleza"
  "Recife"
  "Belém"
  "Florianópolis"
)

TOTAL=30

echo "Iniciando inclusão de $TOTAL clientes com dados randômicos..."
echo

for i in $(seq 1 $TOTAL); do

  # Nome randômico
  NAME="${NOMES[$RANDOM % ${#NOMES[@]}]}"

  # Endereço randômico
  STREET="${RUAS[$RANDOM % ${#RUAS[@]}]}"
  CITY="${CIDADES[$RANDOM % ${#CIDADES[@]}]}"
  NUMBER=$((50 + RANDOM % 450))  # 50..499
  ZIP=$(printf "%05d-%03d" $((10000 + RANDOM % 90000)) $((100 + RANDOM % 900)))

  # Monta JSON numa única linha, sem risco de quebrar o parser
  JSON=$(printf '{"name":"%s","address":{"street":"%s","city":"%s","number":"%d","zip":"%s"}}' \
    "$NAME" "$STREET" "$CITY" "$NUMBER" "$ZIP")

  echo "[$i] Enviando: $NAME - $STREET, $CITY - $NUMBER - CEP $ZIP"

  HTTP_RESPONSE=$(curl --write-out "HTTPSTATUS:%{http_code}" --silent \
    --location "$URL" \
    --header 'Content-Type: application/json' \
    --data-raw "$JSON")

  HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed -e 's/HTTPSTATUS\:.*//g')
  HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

  echo "Status: $HTTP_STATUS"
  echo "Body: $HTTP_BODY"
  echo "---------------------------------------"

  sleep 0.05
done

echo "Finalizado!"
