import { describe, it, expect, beforeEach } from "vitest";
import { createPortal, type Portal } from "../src/lib/portal";

// Tests van contra la interfaz pública del módulo portal (el seam),
// nunca contra SQLite directo — sobreviven un cambio de adapter a Supabase.
let portal: Portal;
beforeEach(() => {
  portal = createPortal(":memory:");
});

describe("Portal de Noticias", () => {
  it("una nota publicada aparece en el listado, la más reciente primero", () => {
    portal.publicarNota({
      titulo: "Empresa dona 20 toneladas de alimentos",
      categoria: "sociales-salud",
      cuerpo: "Texto de la nota.",
      imagen: "https://example.com/a.jpg",
    });
    portal.publicarNota({
      titulo: "Reabre el tramo vial Caracas–La Guaira",
      categoria: "infraestructura",
      cuerpo: "Texto de la nota.",
      imagen: "https://example.com/b.jpg",
    });

    const notas = portal.listarNotas();
    expect(notas).toHaveLength(2);
    expect(notas[0].titulo).toBe("Reabre el tramo vial Caracas–La Guaira");
    expect(notas[0].slug).toBe("reabre-el-tramo-vial-caracas-la-guaira");
    expect(notas[0].publicadaEn).toBeTruthy();
  });

  it("filtra el listado por categoría", () => {
    portal.publicarNota({ titulo: "Nota A", categoria: "infraestructura", cuerpo: "x", imagen: "" });
    portal.publicarNota({ titulo: "Nota B", categoria: "resiliencia", cuerpo: "x", imagen: "" });

    const soloResiliencia = portal.listarNotas("resiliencia");
    expect(soloResiliencia).toHaveLength(1);
    expect(soloResiliencia[0].titulo).toBe("Nota B");
  });

  it("rechaza notas sin título o sin cuerpo", () => {
    expect(() =>
      portal.publicarNota({ titulo: "  ", categoria: "resiliencia", cuerpo: "x", imagen: "" })
    ).toThrow();
    expect(() =>
      portal.publicarNota({ titulo: "Título", categoria: "resiliencia", cuerpo: " ", imagen: "" })
    ).toThrow();
    expect(portal.listarNotas()).toHaveLength(0);
  });

  it("recupera una nota por su slug; slug desconocido devuelve null", () => {
    portal.publicarNota({
      titulo: "Reactivación del comercio en La Guaira",
      categoria: "innovacion-economia",
      cuerpo: "Cuerpo completo.",
      imagen: "",
    });

    const nota = portal.notaPorSlug("reactivacion-del-comercio-en-la-guaira");
    expect(nota?.cuerpo).toBe("Cuerpo completo.");
    expect(portal.notaPorSlug("no-existe")).toBeNull();
  });
});

describe("Cifras de impacto", () => {
  it("el equipo editorial puede reemplazar las cifras y el home las lee", () => {
    portal.actualizarCifras([
      { etiqueta: "Toneladas de ayuda distribuidas", valor: "120" },
      { etiqueta: "Empresas sumadas", valor: "34" },
    ]);
    portal.actualizarCifras([{ etiqueta: "Empresas sumadas", valor: "35" }]);

    const cifras = portal.cifras();
    expect(cifras).toEqual([{ etiqueta: "Empresas sumadas", valor: "35" }]);
  });
});

describe("Formulario Súmate", () => {
  it("guarda una solicitud válida y el equipo la ve en la bandeja", () => {
    portal.recibirSolicitud({
      empresa: "Polar",
      solucion: "Donación de agua potable",
      contacto: "rrss@polar.com",
    });

    const bandeja = portal.listarSolicitudes();
    expect(bandeja).toHaveLength(1);
    expect(bandeja[0].empresa).toBe("Polar");
    expect(bandeja[0].recibidaEn).toBeTruthy();
  });

  it("rechaza solicitudes con campos vacíos o solo espacios", () => {
    expect(() =>
      portal.recibirSolicitud({ empresa: "  ", solucion: "x", contacto: "y" })
    ).toThrow();
    expect(portal.listarSolicitudes()).toHaveLength(0);
  });
});

describe("Contacto", () => {
  it("guarda un mensaje válido y rechaza mensajes vacíos", () => {
    portal.recibirMensaje({ nombre: "Ana", correo: "ana@mail.com", mensaje: "Hola" });
    expect(() =>
      portal.recibirMensaje({ nombre: "Ana", correo: "", mensaje: "Hola" })
    ).toThrow();

    const mensajes = portal.listarMensajes();
    expect(mensajes).toHaveLength(1);
    expect(mensajes[0].correo).toBe("ana@mail.com");
  });
});

describe("Sala de Prensa", () => {
  it("publica un recurso de prensa y lo lista, el más reciente primero", () => {
    portal.publicarRecurso({ titulo: "Comunicado oficial #1", url: "https://x.com/c1.pdf", empresa: "YM Agency" });
    portal.publicarRecurso({ titulo: "Fotos alta resolución", url: "https://x.com/fotos.zip", empresa: "Polar" });

    const recursos = portal.listarRecursos();
    expect(recursos).toHaveLength(2);
    expect(recursos[0].titulo).toBe("Fotos alta resolución");
    expect(recursos[0].publicadoEn).toBeTruthy();
  });
});
