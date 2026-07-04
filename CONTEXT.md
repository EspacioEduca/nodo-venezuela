# CONTEXT.md — Lenguaje del dominio

Vocabulario ubicuo de Nodo Venezuela. Usar estos términos exactos en código, tests, issues y commits.

- **Portal** — el módulo profundo (`src/lib/portal.ts`) que contiene todo el contenido y su lógica. Es la única interfaz hacia la persistencia; las páginas y server actions no conocen SQLite.
- **Nota** — artículo del Portal de Noticias. Tiene título, slug, categoría, cuerpo, imagen destacada y fecha de publicación.
- **Categoría** — una de las cuatro líneas editoriales fijas: Infraestructura y Logística, Iniciativas Sociales y Salud, Innovación y Economía, Historias de Resiliencia.
- **Cifra** — contador de impacto del home (etiqueta + valor), editable por el equipo editorial.
- **Recurso** — elemento descargable de la Sala de Prensa (título + enlace + empresa).
- **Solicitud** — envío del formulario Súmate: una empresa proponiendo su iniciativa para ser publicada.
- **Mensaje** — envío del formulario de Contacto.
- **Equipo editorial** — el equipo de YM Agency que opera el panel `/admin`. No es técnico: todo lo que publique debe poder hacerse sin tocar código.
- **Bandeja** — la vista del panel donde el equipo editorial ve Solicitudes y Mensajes recibidos.
