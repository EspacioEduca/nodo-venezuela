# ADR-0001: SQLite local detrás del seam Portal; BaaS al desplegar

## Estado

Aceptada — 2026-07-04

## Contexto

El prototipo debe correr y probarse localmente sin cuentas externas, y la infraestructura de producción debe costar ~$0/mes y casi cero horas de mantenimiento (organización ad honorem sin equipo de operaciones).

## Decisión

- Toda la persistencia vive detrás de la interfaz **Portal** (`src/lib/portal.ts`). Páginas, server actions y tests solo hablan con esa interfaz — es el seam.
- El adapter del prototipo es **better-sqlite3** con un archivo local (`data/nodo.db`, tests en `:memory:`).
- Para producción, el adapter previsto es **Supabase** (free tier: Postgres + Auth + Storage) con el frontend en **Vercel Hobby** — $0/mes, sin servidores que administrar. Es el mismo stack que el equipo ya usa en `apoyo-terremoto-venezuela`, así que no agrega conocimiento nuevo que mantener.

## Consecuencias

- Los tests de dominio corren en milisegundos sin red.
- Migrar a producción = escribir un segundo adapter de Portal (el seam pasa de hipotético a real); ninguna página cambia.
- SQLite en archivo NO funciona en serverless (Vercel): no desplegar el prototipo tal cual; el swap de adapter es prerequisito del deploy.
- Alternativa descartada: WordPress/Ghost gestionado. Cubre el brief sin escribir código, pero elimina el valor formativo para los estudiantes de Espacio Educa (la razón de ser de la alianza) y ata el mantenimiento a otra plataforma.
