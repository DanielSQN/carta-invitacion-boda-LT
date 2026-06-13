import { getRsvpByInvitation, insertRsvp, isSupabaseConfigured, type RsvpInput } from "@/lib/rsvp";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

function sanitizeNames(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((name) => (typeof name === "string" ? name.trim() : ""))
    .filter((name) => name.length > 0)
    .slice(0, 12);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "JSON inválido" }, { status: 400, headers: noStoreHeaders });
  }

  const attending = Boolean(body.attending);
  const names = sanitizeNames(body.names);
  const guestCount = attending ? Math.min(Math.max(Number(body.guestCount) || names.length || 1, 1), 12) : 0;
  const invitedAs = typeof body.invitedAs === "string" ? body.invitedAs.slice(0, 200) : null;
  const message = typeof body.message === "string" ? body.message.slice(0, 1000).trim() || null : null;

  if (names.length === 0) {
    return Response.json({ ok: false, error: "Falta al menos un nombre" }, { status: 400, headers: noStoreHeaders });
  }

  const payload: RsvpInput = { attending, guestCount, names, invitedAs, message };

  // Sin Supabase configurado: no se persiste, pero la confirmación visual
  // sigue funcionando (modo vista previa).
  if (!isSupabaseConfigured()) {
    console.warn("[rsvp] Supabase no configurado; no se persistió:", payload);
    return Response.json({ ok: true, persisted: false }, { headers: noStoreHeaders });
  }

  try {
    await insertRsvp(payload);
    return Response.json({ ok: true, persisted: true }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("[rsvp] error al guardar:", error);
    return Response.json({ ok: false, error: "No se pudo guardar" }, { status: 500, headers: noStoreHeaders });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const invitedAs = (searchParams.get("invitedAs") || searchParams.get("para") || searchParams.get("invitado") || "").trim();

  if (!invitedAs) {
    return Response.json({ ok: false, error: "Falta invitación" }, { status: 400, headers: noStoreHeaders });
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ ok: true, persisted: false, rsvp: null }, { headers: noStoreHeaders });
  }

  try {
    const rsvp = await getRsvpByInvitation(invitedAs);
    return Response.json({ ok: true, persisted: true, rsvp }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("[rsvp] error al leer:", error);
    return Response.json({ ok: false, error: "No se pudo leer" }, { status: 500, headers: noStoreHeaders });
  }
}
