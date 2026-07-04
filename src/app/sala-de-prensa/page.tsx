import { getPortal } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function SalaDePrensa() {
  const recursos = getPortal().listarRecursos();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold">Sala de Prensa</h1>
      <p className="mt-2 text-neutral-600">
        Kits de prensa para periodistas y medios aliados: fotos en alta resolución,
        comunicados oficiales y material de libre uso.
      </p>

      {recursos.length === 0 ? (
        <p className="mt-10 text-neutral-500">Aún no hay recursos publicados.</p>
      ) : (
        <ul className="mt-8 divide-y rounded-lg border">
          {recursos.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div>
                <p className="font-bold">{r.titulo}</p>
                <p className="text-sm text-neutral-500">
                  {r.empresa && `${r.empresa} · `}
                  {r.publicadoEn.slice(0, 10)}
                </p>
              </div>
              <a
                href={r.url}
                className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-bold text-yellow-400 hover:bg-neutral-800"
                target="_blank"
                rel="noopener"
              >
                Descargar
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
