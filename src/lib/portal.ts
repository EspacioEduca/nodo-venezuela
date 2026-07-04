import Database from "better-sqlite3";

// Módulo profundo del portal: toda la lógica de contenido detrás de una
// interfaz pequeña. Los callers (páginas, server actions, tests) no saben
// que hay SQLite. Ver docs/adr/0001.
export const CATEGORIAS = {
  infraestructura: "Infraestructura y Logística",
  "sociales-salud": "Iniciativas Sociales y Salud",
  "innovacion-economia": "Innovación y Economía",
  resiliencia: "Historias de Resiliencia",
} as const;

export type Categoria = keyof typeof CATEGORIAS;

export interface Nota {
  id: number;
  slug: string;
  titulo: string;
  categoria: Categoria;
  cuerpo: string;
  imagen: string;
  publicadaEn: string;
}

export interface Portal {
  publicarNota(datos: {
    titulo: string;
    categoria: Categoria;
    cuerpo: string;
    imagen: string;
  }): Nota;
  listarNotas(categoria?: Categoria): Nota[];
  notaPorSlug(slug: string): Nota | null;
  cifras(): Cifra[];
  actualizarCifras(cifras: Cifra[]): void;
  recibirSolicitud(datos: { empresa: string; solucion: string; contacto: string }): void;
  listarSolicitudes(): Solicitud[];
  recibirMensaje(datos: { nombre: string; correo: string; mensaje: string }): void;
  listarMensajes(): Mensaje[];
  publicarRecurso(datos: { titulo: string; url: string; empresa: string }): void;
  listarRecursos(): Recurso[];
}

export interface Mensaje {
  id: number;
  nombre: string;
  correo: string;
  mensaje: string;
  recibidoEn: string;
}

export interface Recurso {
  id: number;
  titulo: string;
  url: string;
  empresa: string;
  publicadoEn: string;
}

export interface Solicitud {
  id: number;
  empresa: string;
  solucion: string;
  contacto: string;
  recibidaEn: string;
}

export interface Cifra {
  etiqueta: string;
  valor: string;
}

function slugify(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createPortal(dbPath: string): Portal {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      titulo TEXT NOT NULL,
      categoria TEXT NOT NULL,
      cuerpo TEXT NOT NULL,
      imagen TEXT NOT NULL,
      publicada_en TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS cifras (
      orden INTEGER PRIMARY KEY,
      etiqueta TEXT NOT NULL,
      valor TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS solicitudes (
      id INTEGER PRIMARY KEY,
      empresa TEXT NOT NULL,
      solucion TEXT NOT NULL,
      contacto TEXT NOT NULL,
      recibida_en TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS mensajes (
      id INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL,
      mensaje TEXT NOT NULL,
      recibido_en TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS recursos (
      id INTEGER PRIMARY KEY,
      titulo TEXT NOT NULL,
      url TEXT NOT NULL,
      empresa TEXT NOT NULL,
      publicado_en TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const filaANota = (f: Record<string, unknown>): Nota => ({
    id: f.id as number,
    slug: f.slug as string,
    titulo: f.titulo as string,
    categoria: f.categoria as Categoria,
    cuerpo: f.cuerpo as string,
    imagen: f.imagen as string,
    publicadaEn: f.publicada_en as string,
  });

  return {
    publicarNota(datos) {
      if (!datos.titulo?.trim() || !datos.cuerpo?.trim()) {
        throw new Error("Título y cuerpo son obligatorios");
      }
      const slug = slugify(datos.titulo);
      db.prepare(
        "INSERT INTO notas (slug, titulo, categoria, cuerpo, imagen) VALUES (?, ?, ?, ?, ?)"
      ).run(slug, datos.titulo, datos.categoria, datos.cuerpo, datos.imagen);
      return this.listarNotas()[0];
    },

    listarNotas(categoria) {
      const filas = categoria
        ? db.prepare("SELECT * FROM notas WHERE categoria = ? ORDER BY id DESC").all(categoria)
        : db.prepare("SELECT * FROM notas ORDER BY id DESC").all();
      return filas.map((f) => filaANota(f as Record<string, unknown>));
    },

    notaPorSlug(slug) {
      const fila = db.prepare("SELECT * FROM notas WHERE slug = ?").get(slug);
      return fila ? filaANota(fila as Record<string, unknown>) : null;
    },

    cifras() {
      return db
        .prepare("SELECT etiqueta, valor FROM cifras ORDER BY orden")
        .all() as Cifra[];
    },

    // Frontera de confianza: entrada pública, se valida siempre.
    // ponytail: la notificación por correo al equipo editorial queda fuera del
    // prototipo — la bandeja en /admin la cubre; añadir Resend/SMTP al desplegar.
    recibirSolicitud(datos) {
      const empresa = datos.empresa?.trim();
      const solucion = datos.solucion?.trim();
      const contacto = datos.contacto?.trim();
      if (!empresa || !solucion || !contacto) {
        throw new Error("Todos los campos son obligatorios");
      }
      db.prepare(
        "INSERT INTO solicitudes (empresa, solucion, contacto) VALUES (?, ?, ?)"
      ).run(empresa, solucion, contacto);
    },

    listarSolicitudes() {
      return db
        .prepare(
          "SELECT id, empresa, solucion, contacto, recibida_en AS recibidaEn FROM solicitudes ORDER BY id DESC"
        )
        .all() as Solicitud[];
    },

    recibirMensaje(datos) {
      const nombre = datos.nombre?.trim();
      const correo = datos.correo?.trim();
      const mensaje = datos.mensaje?.trim();
      if (!nombre || !correo || !mensaje) {
        throw new Error("Todos los campos son obligatorios");
      }
      db.prepare("INSERT INTO mensajes (nombre, correo, mensaje) VALUES (?, ?, ?)").run(
        nombre, correo, mensaje
      );
    },

    listarMensajes() {
      return db
        .prepare(
          "SELECT id, nombre, correo, mensaje, recibido_en AS recibidoEn FROM mensajes ORDER BY id DESC"
        )
        .all() as Mensaje[];
    },

    // ponytail: el "repositorio de archivos" es una lista de enlaces (Drive,
    // Dropbox, etc.) — subir/almacenar archivos requiere storage; añadir
    // Supabase Storage al desplegar si YM lo necesita.
    publicarRecurso(datos) {
      db.prepare("INSERT INTO recursos (titulo, url, empresa) VALUES (?, ?, ?)").run(
        datos.titulo, datos.url, datos.empresa
      );
    },

    listarRecursos() {
      return db
        .prepare(
          "SELECT id, titulo, url, empresa, publicado_en AS publicadoEn FROM recursos ORDER BY id DESC"
        )
        .all() as Recurso[];
    },

    // ponytail: reemplazo total en vez de CRUD por fila — son 3-5 cifras, el
    // admin manda la lista completa cada vez.
    actualizarCifras(cifras) {
      const insertar = db.prepare("INSERT INTO cifras (orden, etiqueta, valor) VALUES (?, ?, ?)");
      db.transaction(() => {
        db.prepare("DELETE FROM cifras").run();
        cifras.forEach((c, i) => insertar.run(i, c.etiqueta, c.valor));
      })();
    },
  };
}
