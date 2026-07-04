import Link from "next/link";
import { getPortal } from "@/lib/db";
import { NotaCard } from "./nota-card";

export const dynamic = "force-dynamic";

export default function Inicio() {
  const portal = getPortal();
  const ultimas = portal.listarNotas().slice(0, 4);
  const cifras = portal.cifras();
  const aliados = [...new Set(portal.listarRecursos().map((r) => r.empresa).filter(Boolean))];

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-neutral-950 px-6 py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Noticias que <span className="text-yellow-400">reconstruyen</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-300">
          Los avances, soluciones e historias de resiliencia detrás de la recuperación de
          Venezuela tras el terremoto del 24 de junio.
        </p>
        <Link
          href="/noticias"
          className="mt-8 inline-block rounded-full bg-yellow-400 px-6 py-3 font-bold text-neutral-950 hover:bg-yellow-300"
        >
          Ver el Portal de Noticias
        </Link>
      </section>

      {cifras.length > 0 && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cifras.map((c) => (
            <div key={c.etiqueta} className="rounded-lg border p-4 text-center">
              <p className="text-3xl font-extrabold text-yellow-500">{c.valor}</p>
              <p className="mt-1 text-sm text-neutral-600">{c.etiqueta}</p>
            </div>
          ))}
        </section>
      )}

      {ultimas.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold">Lo más reciente</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ultimas.map((n) => (
              <NotaCard key={n.id} nota={n} />
            ))}
          </div>
        </section>
      )}

      {aliados.length > 0 && (
        <section className="rounded-lg bg-neutral-100 p-6 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Aliados que impulsan soluciones
          </h2>
          <p className="mt-3 flex flex-wrap justify-center gap-x-8 gap-y-2 font-bold text-neutral-700">
            {aliados.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </p>
        </section>
      )}
    </div>
  );
}
