import { enviarMensaje } from "../actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400";

export default async function Contacto({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; error?: string }>;
}) {
  const { enviado, error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold">Contacto</h1>
      <p className="mt-2 text-neutral-600">
        Escríbenos a{" "}
        <a href="mailto:soluciones@ymagency.com" className="font-semibold underline">
          soluciones@ymagency.com
        </a>{" "}
        o síguenos en{" "}
        <a href="https://instagram.com/ymagency_" className="font-semibold underline">
          @YMAGENCY_
        </a>
        .
      </p>

      {enviado && (
        <p className="mt-4 rounded-md bg-green-50 p-3 text-green-800">Mensaje enviado. Gracias.</p>
      )}
      {error && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-red-800">
          Todos los campos son obligatorios.
        </p>
      )}

      <form action={enviarMensaje} className="mt-8 space-y-4">
        <label className="block text-sm font-semibold">
          Nombre
          <input name="nombre" required className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Correo
          <input name="correo" type="email" required className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Mensaje
          <textarea name="mensaje" required rows={4} className={input} />
        </label>
        <button className="rounded-full bg-yellow-400 px-6 py-3 font-bold text-neutral-950 hover:bg-yellow-300">
          Enviar
        </button>
      </form>
    </div>
  );
}
