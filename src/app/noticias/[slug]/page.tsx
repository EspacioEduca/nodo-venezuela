import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortal } from "@/lib/db";
import { CATEGORIAS } from "@/lib/portal";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nota = getPortal().notaPorSlug(slug);
  if (!nota) return {};
  return {
    title: `${nota.titulo} — Nodo Venezuela`,
    description: nota.cuerpo.slice(0, 155),
  };
}

export default async function Articulo({ params }: Props) {
  const { slug } = await params;
  const nota = getPortal().notaPorSlug(slug);
  if (!nota) notFound();

  return (
    <article className="mx-auto max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
        {CATEGORIAS[nota.categoria]}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight">{nota.titulo}</h1>
      <p className="mt-2 text-sm text-neutral-500">{nota.publicadaEn.slice(0, 10)}</p>
      {nota.imagen && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={nota.imagen} alt="" className="mt-6 w-full rounded-lg" />
      )}
      {/* ponytail: cuerpo en texto plano con saltos de línea; editor de texto
          enriquecido (markdown) cuando el equipo editorial lo pida. */}
      <div className="mt-6 whitespace-pre-line leading-relaxed">{nota.cuerpo}</div>
    </article>
  );
}
