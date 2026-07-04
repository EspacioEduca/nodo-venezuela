# Nodo Venezuela — Noticias que reconstruyen

**Demo navegable (solo lectura):** https://espacioeduca.github.io/nodo-venezuela/ — snapshot estático de las páginas públicas para revisión de YM Agency. Los formularios y el panel `/admin` solo funcionan corriendo el prototipo (abajo). Para regenerar el demo: `npm run seed && ./scripts/demo-estatico.sh` y push de `site/` a la rama `gh-pages`.

Prototipo funcional del portal del brief de YM Agency. Secciones: Inicio, Portal de Noticias (4 categorías con filtro), Sala de Prensa, Alianza por Venezuela (form Súmate) y Contacto. Panel editorial en `/admin`.

## Correr localmente

```bash
npm install
npm run seed   # contenido de demostración
npm run dev    # http://localhost:3000
```

Tests: `npm test`.

## Manual breve del panel editorial (`/admin`)

1. Entra a `/admin` con la clave (`NODO_ADMIN_PASSWORD`; en desarrollo: `nodo-demo`).
2. **Publicar nota**: título, categoría, URL de imagen (opcional) y cuerpo. Aparece de inmediato en el home y el Portal de Noticias.
3. **Cifras de impacto**: una por línea con el formato `Etiqueta | valor`. Guardar reemplaza las anteriores.
4. **Recurso de prensa**: título + enlace de descarga (Drive/Dropbox) + empresa. Aparece en Sala de Prensa.
5. **Bandejas**: las solicitudes Súmate y los mensajes de Contacto llegan aquí, más reciente primero.

## Producción prevista

Vercel Hobby + Supabase free tier (~$0/mes). Ver `docs/adr/0001` — el prototipo usa SQLite local y **no debe desplegarse tal cual a serverless**; primero se escribe el adapter Supabase del módulo Portal.

Pendientes deliberados (buscar `ponytail:` en el código): notificación por correo de los formularios, texto enriquecido en notas, subida de archivos de prensa, usuarios/roles en el panel.
