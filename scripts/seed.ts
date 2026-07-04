// Datos de demostración para pruebas funcionales: npm run seed
import { createPortal } from "../src/lib/portal";
import fs from "node:fs";

fs.mkdirSync("data", { recursive: true });
const portal = createPortal("data/nodo.db");

if (portal.listarNotas().length > 0) {
  console.log("La base ya tiene contenido; no se siembra de nuevo.");
  process.exit(0);
}

portal.publicarNota({
  titulo: "Constructoras reabren el tramo vial hacia La Guaira en tiempo récord",
  categoria: "infraestructura",
  cuerpo:
    "Un consorcio de empresas constructoras completó la rehabilitación del tramo vial que conecta Caracas con La Guaira, restableciendo el paso de ayuda humanitaria y carga.\n\nLos trabajos, coordinados con Protección Civil, tomaron nueve días.",
  imagen: "",
});
portal.publicarNota({
  titulo: "Jornada médica atiende a 1.200 personas en refugios de Yaracuy",
  categoria: "sociales-salud",
  cuerpo:
    "Una alianza de laboratorios y clínicas privadas desplegó una jornada de atención médica y entrega de medicamentos en los refugios habilitados en San Felipe.",
  imagen: "",
});
portal.publicarNota({
  titulo: "Fintech habilita donaciones sin comisión para la reconstrucción",
  categoria: "innovacion-economia",
  cuerpo:
    "La plataforma eliminó las comisiones de las transferencias destinadas a organizaciones verificadas que trabajan en las zonas afectadas.",
  imagen: "",
});
portal.publicarNota({
  titulo: "La panadería que volvió a encender sus hornos para su comunidad",
  categoria: "resiliencia",
  cuerpo:
    "A tres días del terremoto, una panadería de Montalbán reabrió para hornear pan gratuito para los vecinos de su cuadra. Hoy produce el doble que antes de la emergencia.",
  imagen: "",
});

portal.actualizarCifras([
  { etiqueta: "Toneladas de ayuda distribuidas", valor: "120" },
  { etiqueta: "Zonas reactivadas", valor: "18" },
  { etiqueta: "Empresas sumadas", valor: "34" },
  { etiqueta: "Notas publicadas", valor: "4" },
]);

portal.publicarRecurso({
  titulo: "Comunicado oficial de lanzamiento",
  url: "https://example.com/comunicado.pdf",
  empresa: "YM Agency",
});

console.log("Contenido de demostración cargado en data/nodo.db");
