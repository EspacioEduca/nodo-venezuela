#!/usr/bin/env bash
# Genera en site/ el demo estático de las páginas públicas para GitHub Pages.
# Requiere datos: npm run seed. Publicar: push de site/ a la rama gh-pages.
set -euo pipefail
cd "$(dirname "$0")/.."

export PAGES_BASE=/nodo-venezuela
npm run build
PORT=3199 npm start >/dev/null 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null' EXIT
sleep 4

rutas=(/ /noticias /sala-de-prensa /alianza /contacto)
while read -r slug; do rutas+=("/noticias/$slug"); done < <(node --input-type=module -e "
import Database from 'better-sqlite3';
const db = new Database('data/nodo.db', { readonly: true });
for (const r of db.prepare('SELECT slug FROM notas').all()) console.log(r.slug);
")

rm -rf site && mkdir -p site
for r in "${rutas[@]}"; do
  mkdir -p "site$r"
  curl -sfL "http://localhost:3199$PAGES_BASE$r" -o "site$r/index.html"
done
mkdir -p site/_next
cp -r .next/static site/_next/static
touch site/.nojekyll

echo "Demo estático generado en site/ (${#rutas[@]} páginas)"
