import Link from "next/link";
import { CATEGORIAS, type Nota } from "@/lib/portal";

export function NotaCard({ nota }: { nota: Nota }) {
  return (
    <Link
      href={`/noticias/${nota.slug}`}
      className="block overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
    >
      {nota.imagen && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={nota.imagen} alt="" className="h-40 w-full object-cover" loading="lazy" />
      )}
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-600">
          {CATEGORIAS[nota.categoria]}
        </p>
        <h3 className="mt-1 font-bold leading-snug">{nota.titulo}</h3>
        <p className="mt-2 text-xs text-neutral-500">{nota.publicadaEn.slice(0, 10)}</p>
      </div>
    </Link>
  );
}
