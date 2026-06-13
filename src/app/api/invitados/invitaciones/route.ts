import { cookies } from "next/headers";
import { INVITADOS_COOKIE, isInvitadosAuthed } from "@/lib/invitadosAuth";
import { deleteInvitation, isInvitationsAvailable, upsertInvitations, type InvitationInput } from "@/lib/invitations";

export const dynamic = "force-dynamic";

async function requireAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return isInvitadosAuthed(cookieStore.get(INVITADOS_COOKIE)?.value);
}

// Importar invitaciones: una lista de nombres (el valor de ?para=), uno por
// línea. Solo se toma el nombre (primera columna si viene de un CSV).
const CSV_HEADER = /^(nombre|para|invitaci[oó]n|label|guest)s?$/i;

export async function POST(request: Request) {
  if (!(await requireAuth())) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let body: { text?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text : "";
  const seen = new Set<string>();
  const inputs: InvitationInput[] = [];

  text.split(/\r?\n/).forEach((rawLine, index) => {
    // Primera columna (por si pegan un CSV con más columnas) sin comillas.
    const label = (rawLine.split(/[,;]/)[0] ?? "").replace(/^["']|["']$/g, "").trim();

    if (!label || (index === 0 && CSV_HEADER.test(label))) {
      return;
    }

    if (seen.has(label.toLowerCase())) {
      return;
    }

    seen.add(label.toLowerCase());
    inputs.push({ label: label.slice(0, 200) });
  });

  if (inputs.length === 0) {
    return Response.json({ ok: false, error: "No hay invitaciones válidas" }, { status: 400 });
  }

  if (!isInvitationsAvailable()) {
    return Response.json({ ok: false, error: "Supabase no está configurado" }, { status: 503 });
  }

  try {
    await upsertInvitations(inputs);
    return Response.json({ ok: true, count: inputs.length });
  } catch {
    return Response.json({ ok: false, error: "No se pudo guardar" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAuth())) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let id = "";

  try {
    const body = await request.json();
    id = typeof body.id === "string" ? body.id : "";
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!id) {
    return Response.json({ ok: false, error: "Falta id" }, { status: 400 });
  }

  try {
    await deleteInvitation(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "No se pudo eliminar" }, { status: 500 });
  }
}
