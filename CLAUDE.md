# Nodo Venezuela — Guía para agentes

Portal informativo sobre la recuperación de Venezuela tras el terremoto del 24-jun-2026 (brief de YM Agency, desarrollo de Espacio Educa). Prototipo funcional: Next.js 16 + React 19 + Tailwind 4, dominio en `src/lib/portal.ts` sobre SQLite local.

## Reglas de arquitectura

- **Todo pasa por Portal.** Páginas y server actions solo usan la interfaz `Portal` (`getPortal()` de `src/lib/db.ts`). Nada fuera de `src/lib/` importa `better-sqlite3`. Ver `docs/adr/0001`.
- **CONTEXT.md manda.** Usar su vocabulario exacto (Nota, Cifra, Recurso, Solicitud, Mensaje, Bandeja). Concepto nuevo o renombrado → actualizar CONTEXT.md en el mismo commit.
- **Fronteras de confianza no se simplifican.** Los formularios públicos (Súmate, Contacto) siempre validan en el dominio, no solo en el HTML.
- Los tests van contra la interfaz Portal (comportamiento), nunca contra el esquema SQL.

## Comandos

- `npm test` — suite de dominio (vitest, `:memory:`)
- `npm run seed` — datos de demostración en `data/nodo.db`
- `npm run dev` / `npm run build && npm start`
- Panel editorial: `/admin`, clave = `NODO_ADMIN_PASSWORD` (default dev: `nodo-demo`)

Antes de dar una tarea por terminada: `npm test` y `npm run build` en verde.

## Agent skills

### Issue tracker

Markdown local bajo `.scratch/<feature>/` (sin remoto aún). Ver `docs/agents/issue-tracker.md`.

### Triage labels

Vocabulario por defecto (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). Ver `docs/agents/triage-labels.md`.

### Domain docs

Single-context (`CONTEXT.md` y `docs/adr/` en la raíz). Ver `docs/agents/domain.md`.
