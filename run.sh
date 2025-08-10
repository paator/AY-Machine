#!/usr/bin/env bash

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

while true; do
  echo "[run] building..."
  npm run build >/dev/null 2>&1 || echo "[run] build failed; starting anyway"
  echo "[run] starting bot..."
  npm start
  code=$?
  echo "[run] bot exited with code $code; restarting in 2s..."
  sleep 2
done


