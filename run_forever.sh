#!/usr/bin/env bash

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

while true; do
  echo "[run_forever] starting bot..."
  npm start
  code=$?
  echo "[run_forever] bot exited with code $code; restarting in 2s..."
  sleep 2
done
