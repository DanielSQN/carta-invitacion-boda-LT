import { cookies } from "next/headers";
import { INVITADOS_COOKIE, isInvitadosAuthed } from "@/lib/invitadosAuth";
import {
  deleteInvitation,
  isInvitationsAvailable,
  updateInvitationGuests,
  upsertInvitations,
  type InvitationInput,
} from "@/lib/invitations";

export const dynamic = "force-dynamic";

async function requireAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return isInvitadosAuthed(cookieStore.get(INVITADOS_COOKIE)?.value);
}

// Importar invitaciones: una lista de nombres (el valor de ?para=), uno por
// línea. Primera columna: nombre; segunda columna (opcional): cupo de
// asistentes de esa invitación.
const CSV_HEADER = /^(nombre|para|invitaci[oó]n|label|guest)s?$/i;
const MAX_GUESTS = 12;

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
    const [rawLabel, rawCupo] = rawLine.split(/[,;]/);
    const unquote = (value: string) => value.replace(/^["']|["']$/g, "").trim();
    const label = unquote(rawLabel ?? "");
    const cupoText = unquote(rawCupo ?? "");
    const cupo = /^\d{1,2}$/.test(cupoText) ? Math.min(Math.max(Number(cupoText), 1), MAX_GUESTS) : null;

    if (!label || (index === 0 && CSV_HEADER.test(label))) {
      return;
    }

    if (seen.has(label.toLowerCase())) {
      return;
    }

    seen.add(label.toLowerCase());
    inputs.push({ label: label.slice(0, 200), guestsPlanned: cupo });
  });

  if (inputs.length === 0) {
    return Response.json({ ok: false, error: "No hay invitaciones válidas" }, { status: 400 });
  }

  if (!isInvitationsAvailable()) {
    return Response.json({ ok: false, error: "Supabase no está configurado" }, { status: 503 });
  }

  // Las líneas CON cupo actualizan el cupo aunque el nombre ya exista; las
  // líneas SIN cupo no tocan lo que ya haya (reimportar la lista completa no
  // borra los cupos asignados antes).
  const withCupo = inputs.filter((input) => input.guestsPlanned !== null);
  const withoutCupo = inputs.filter((input) => input.guestsPlanned === null);

  try {
    await upsertInvitations(withCupo, "merge");
    await upsertInvitations(withoutCupo, "ignore");
    return Response.json({ ok: true, count: inputs.length });
  } catch {
    return Response.json({ ok: false, error: "No se pudo guardar" }, { status: 500 });
  }
}

// Cambiar el cupo de asistentes de una invitación desde el panel.
export async function PATCH(request: Request) {
  if (!(await requireAuth())) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let body: { id?: unknown; guestsPlanned?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";

  if (!id) {
    return Response.json({ ok: false, error: "Falta id" }, { status: 400 });
  }

  let guestsPlanned: number | null = null;

  if (body.guestsPlanned !== null && body.guestsPlanned !== undefined && body.guestsPlanned !== "") {
    const parsed = Number(body.guestsPlanned);

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_GUESTS) {
      return Response.json({ ok: false, error: `El cupo debe ser un número entre 1 y ${MAX_GUESTS}` }, { status: 400 });
    }

    guestsPlanned = parsed;
  }

  try {
    await updateInvitationGuests(id, guestsPlanned);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "No se pudo actualizar el cupo" }, { status: 500 });
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
