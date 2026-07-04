import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nodo Venezuela — Noticias que reconstruyen",
  description:
    "Portal informativo sobre la recuperación de Venezuela tras el terremoto del 24 de junio: soluciones, aportes empresariales e historias de resiliencia.",
};

const SECCIONES = [
  ["/", "Inicio"],
  ["/noticias", "Noticias"],
  ["/sala-de-prensa", "Sala de Prensa"],
  ["/alianza", "Alianza por Venezuela"],
  ["/contacto", "Contacto"],
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col bg-white text-neutral-900 antialiased">
        {process.env.PAGES_BASE && (
          <p className="bg-yellow-400 px-4 py-2 text-center text-sm font-semibold text-neutral-950">
            Demo estático de revisión — los formularios y el panel editorial funcionan en la
            versión completa del prototipo.
          </p>
        )}
        <header className="bg-neutral-950 text-white">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4">
            <Link href="/" className="text-lg font-extrabold tracking-tight">
              Nodo<span className="text-yellow-400">Venezuela</span>
            </Link>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-300">
              {SECCIONES.map(([href, label]) => (
                <Link key={href} href={href} className="hover:text-yellow-400">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="mt-12 border-t bg-neutral-950 px-4 py-6 text-center text-sm text-neutral-400">
          Nodo Venezuela — Powered by YM Agency · Desarrollo web por Espacio Educa
        </footer>
      </body>
    </html>
  );
}
