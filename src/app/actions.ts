"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPortal } from "@/lib/db";
import { CATEGORIAS, type Categoria } from "@/lib/portal";

const campo = (fd: FormData, k: string) => String(fd.get(k) ?? "");

export async function enviarSolicitud(fd: FormData) {
  let ok = true;
  try {
    getPortal().recibirSolicitud({
      empresa: campo(fd, "empresa"),
      solucion: campo(fd, "solucion"),
      contacto: campo(fd, "contacto"),
    });
  } catch {
    ok = false;
  }
  redirect(ok ? "/alianza?enviado=1" : "/alianza?error=1");
}

export async function enviarMensaje(fd: FormData) {
  let ok = true;
  try {
    getPortal().recibirMensaje({
      nombre: campo(fd, "nombre"),
      correo: campo(fd, "correo"),
      mensaje: campo(fd, "mensaje"),
    });
  } catch {
    ok = false;
  }
  redirect(ok ? "/contacto?enviado=1" : "/contacto?error=1");
}

// --- Admin ---
// ponytail: una sola clave compartida en env var; con usuarios/roles migrar a
// Supabase Auth al desplegar.
const CLAVE = () => process.env.NODO_ADMIN_PASSWORD || "nodo-demo";

export async function esAdmin(): Promise<boolean> {
  const jar = await cookies();
  return jar.get("nodo_admin")?.value === CLAVE();
}

async function exigirAdmin() {
  if (!(await esAdmin())) redirect("/admin");
}

export async function adminLogin(fd: FormData) {
  if (campo(fd, "clave") === CLAVE()) {
    const jar = await cookies();
    jar.set("nodo_admin", CLAVE(), { httpOnly: true, sameSite: "lax", path: "/" });
  }
  redirect("/admin");
}

export async function adminPublicarNota(fd: FormData) {
  await exigirAdmin();
  const categoria = campo(fd, "categoria") as Categoria;
  if (!(categoria in CATEGORIAS)) redirect("/admin?error=1");
  try {
    getPortal().publicarNota({
      titulo: campo(fd, "titulo").trim(),
      categoria,
      cuerpo: campo(fd, "cuerpo").trim(),
      imagen: campo(fd, "imagen").trim(),
    });
  } catch {
    redirect("/admin?error=1");
  }
  revalidatePath("/");
  redirect("/admin?ok=1");
}

export async function adminActualizarCifras(fd: FormData) {
  await exigirAdmin();
  // Una cifra por línea: "Etiqueta | valor"
  const cifras = campo(fd, "cifras")
    .split("\n")
    .map((l) => l.split("|"))
    .filter((p) => p.length === 2 && p[0].trim() && p[1].trim())
    .map(([etiqueta, valor]) => ({ etiqueta: etiqueta.trim(), valor: valor.trim() }));
  getPortal().actualizarCifras(cifras);
  revalidatePath("/");
  redirect("/admin?ok=1");
}

export async function adminPublicarRecurso(fd: FormData) {
  await exigirAdmin();
  const titulo = campo(fd, "titulo").trim();
  const url = campo(fd, "url").trim();
  const empresa = campo(fd, "empresa").trim();
  if (!titulo || !url) redirect("/admin?error=1");
  getPortal().publicarRecurso({ titulo, url, empresa });
  revalidatePath("/sala-de-prensa");
  redirect("/admin?ok=1");
}
