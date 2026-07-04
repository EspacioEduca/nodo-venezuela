import Link from "next/link";
import { getPortal } from "@/lib/db";
import { CATEGORIAS, type Categoria } from "@/lib/portal";
import { NotaCard } from "../nota-card";

export const dynamic = "force-dynamic";

export default async function Noticias({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const activa = categoria && categoria in CATEGORIAS ? (categoria as Categoria) : undefined;
  const notas = getPortal().listarNotas(activa);

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Portal de Noticias</h1>
      <p className="mt-1 text-neutral-600">Noticias que reconstruyen.</p>

      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/noticias"
          className={`rounded-full border px-3 py-1 ${!activa ? "bg-neutral-950 text-yellow-400" : "hover:bg-neutral-100"}`}
        >
          Todas
        </Link>
        {Object.entries(CATEGORIAS).map(([clave, nombre]) => (
          <Link
            key={clave}
            href={`/noticias?categoria=${clave}`}
            className={`rounded-full border px-3 py-1 ${activa === clave ? "bg-neutral-950 text-yellow-400" : "hover:bg-neutral-100"}`}
          >
            {nombre}
          </Link>
        ))}
      </nav>

      {notas.length === 0 ? (
        <p className="mt-10 text-neutral-500">Aún no hay notas en esta categoría.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notas.map((n) => (
            <NotaCard key={n.id} nota={n} />
          ))}
        </div>
      )}
    </div>
  );
}
