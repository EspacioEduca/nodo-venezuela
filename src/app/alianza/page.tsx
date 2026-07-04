import { enviarSolicitud } from "../actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400";

export default async function Alianza({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; error?: string }>;
}) {
  const { enviado, error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <section>
        <h1 className="text-3xl font-extrabold">Alianza por Venezuela</h1>
        <p className="mt-4 leading-relaxed text-neutral-700">
          Nodo Venezuela es una iniciativa pro-bono de responsabilidad social de YM Agency.
          Su propósito es visibilizar, con evidencia verificable, los esfuerzos de empresas y
          organizaciones que aportan soluciones a la recuperación del país tras el terremoto
          del 24 de junio. El desarrollo técnico del portal es obra de Espacio Educa, como
          parte de su programa de formación en desarrollo web para jóvenes de Caracas.
        </p>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="text-2xl font-bold">Súmate</h2>
        <p className="mt-2 text-neutral-600">
          ¿Tu empresa está aportando una solución? Cuéntanos y el equipo editorial evaluará
          publicarla en el portal.
        </p>

        {enviado && (
          <p className="mt-4 rounded-md bg-green-50 p-3 text-green-800">
            Solicitud recibida. El equipo editorial te contactará pronto.
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-red-800">
            Todos los campos son obligatorios. Inténtalo de nuevo.
          </p>
        )}

        <form action={enviarSolicitud} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Nombre de la empresa
            <input name="empresa" required className={input} />
          </label>
          <label className="block text-sm font-semibold">
            Tipo de solución o iniciativa
            <textarea name="solucion" required rows={3} className={input} />
          </label>
          <label className="block text-sm font-semibold">
            Contacto (correo o teléfono)
            <input name="contacto" required className={input} />
          </label>
          <button className="rounded-full bg-yellow-400 px-6 py-3 font-bold text-neutral-950 hover:bg-yellow-300">
            Enviar solicitud
          </button>
        </form>
      </section>
    </div>
  );
}
