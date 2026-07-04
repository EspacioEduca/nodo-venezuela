import { getPortal } from "@/lib/db";
import { CATEGORIAS } from "@/lib/portal";
import {
  adminActualizarCifras,
  adminLogin,
  adminPublicarNota,
  adminPublicarRecurso,
  esAdmin,
} from "../actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400";
const boton =
  "rounded-full bg-neutral-950 px-5 py-2 text-sm font-bold text-yellow-400 hover:bg-neutral-800";

export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;

  if (!(await esAdmin())) {
    return (
      <form action={adminLogin} className="mx-auto mt-16 max-w-sm space-y-4 rounded-lg border p-6">
        <h1 className="text-xl font-extrabold">Panel editorial</h1>
        <label className="block text-sm font-semibold">
          Clave
          <input name="clave" type="password" required className={input} />
        </label>
        <button className={boton}>Entrar</button>
      </form>
    );
  }

  const portal = getPortal();
  const cifras = portal.cifras();
  const solicitudes = portal.listarSolicitudes();
  const mensajes = portal.listarMensajes();

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold">Panel editorial</h1>
      {ok && <p className="rounded-md bg-green-50 p-3 text-green-800">Cambios guardados.</p>}
      {error && <p className="rounded-md bg-red-50 p-3 text-red-800">Revisa los campos: título y cuerpo son obligatorios y el título no puede repetirse.</p>}

      <section className="rounded-lg border p-6">
        <h2 className="text-xl font-bold">Publicar nota</h2>
        <form action={adminPublicarNota} className="mt-4 space-y-3">
          <input name="titulo" placeholder="Título" required className={input} />
          <select name="categoria" className={input}>
            {Object.entries(CATEGORIAS).map(([clave, nombre]) => (
              <option key={clave} value={clave}>
                {nombre}
              </option>
            ))}
          </select>
          <input name="imagen" placeholder="URL de imagen destacada (opcional)" className={input} />
          <textarea name="cuerpo" placeholder="Cuerpo de la nota" required rows={8} className={input} />
          <button className={boton}>Publicar</button>
        </form>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-xl font-bold">Cifras de impacto</h2>
        <p className="mt-1 text-sm text-neutral-500">Una por línea: Etiqueta | valor</p>
        <form action={adminActualizarCifras} className="mt-4 space-y-3">
          <textarea
            name="cifras"
            rows={4}
            className={input}
            defaultValue={cifras.map((c) => `${c.etiqueta} | ${c.valor}`).join("\n")}
          />
          <button className={boton}>Guardar cifras</button>
        </form>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-xl font-bold">Publicar recurso de prensa</h2>
        <form action={adminPublicarRecurso} className="mt-4 space-y-3">
          <input name="titulo" placeholder="Título del recurso" required className={input} />
          <input name="url" placeholder="Enlace de descarga (Drive, Dropbox…)" required className={input} />
          <input name="empresa" placeholder="Empresa o iniciativa (opcional)" className={input} />
          <button className={boton}>Publicar recurso</button>
        </form>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-xl font-bold">Bandeja: Súmate ({solicitudes.length})</h2>
        <ul className="mt-4 divide-y text-sm">
          {solicitudes.map((s) => (
            <li key={s.id} className="py-3">
              <p className="font-bold">{s.empresa}</p>
              <p className="text-neutral-700">{s.solucion}</p>
              <p className="text-neutral-500">
                {s.contacto} · {s.recibidaEn}
              </p>
            </li>
          ))}
          {solicitudes.length === 0 && <li className="py-3 text-neutral-500">Sin solicitudes.</li>}
        </ul>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-xl font-bold">Bandeja: Contacto ({mensajes.length})</h2>
        <ul className="mt-4 divide-y text-sm">
          {mensajes.map((m) => (
            <li key={m.id} className="py-3">
              <p className="font-bold">
                {m.nombre} <span className="font-normal text-neutral-500">{m.correo}</span>
              </p>
              <p className="text-neutral-700">{m.mensaje}</p>
              <p className="text-neutral-500">{m.recibidoEn}</p>
            </li>
          ))}
          {mensajes.length === 0 && <li className="py-3 text-neutral-500">Sin mensajes.</li>}
        </ul>
      </section>
    </div>
  );
}
