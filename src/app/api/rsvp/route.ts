import { getInvitationByLabel } from "@/lib/invitations";
import { getClientIp, isRateLimited } from "@/lib/rateLimit";
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
  // Freno de spam: nadie necesita enviar más de un puñado de confirmaciones.
  if (isRateLimited(`rsvp-post:${getClientIp(request)}`, 8, 60_000)) {
    return Response.json(
      { ok: false, error: "Demasiados intentos, espera un momento" },
      { status: 429, headers: noStoreHeaders },
    );
  }

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

  // Cupo por invitación, validado en el servidor (el formulario ya lo limita
  // en la interfaz, esto evita saltárselo con una petición armada a mano):
  //   - "para" con cupo asignado  -> se recorta a ese cupo.
  //   - "para" sin cupo, "para" inexistente o sin "para" -> solo 1 asistente,
  //     igual que la interfaz. Se respeta una confirmación previa mayor (por
  //     si el cupo se retiró después de que el invitado ya había confirmado).
  //   - Si Supabase falla al consultar, no se bloquea la confirmación (se
  //     acepta tal cual llegó y se registra el aviso).
  if (attending) {
    try {
      const allowed = invitedAs ? ((await getInvitationByLabel(invitedAs))?.guestsPlanned ?? null) : null;

      let cap = 1;

      if (allowed && allowed > 0) {
        cap = allowed;
      } else if (invitedAs) {
        const existing = await getRsvpByInvitation(invitedAs);

        if (existing?.attending && existing.guestCount > cap) {
          cap = Math.min(existing.guestCount, 12);
        }
      }

      payload.guestCount = Math.min(payload.guestCount, cap);
      payload.names = payload.names.slice(0, cap);
    } catch (error) {
      console.warn("[rsvp] no se pudo verificar el cupo de la invitación:", error);
    }
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
  // Freno de enumeración: la consulta devuelve la respuesta guardada de una
  // invitación (nombres), así que se limita el ritmo de lecturas por IP para
  // que no se pueda barrer la lista probando valores de ?para= en masa.
  if (isRateLimited(`rsvp-get:${getClientIp(request)}`, 30, 60_000)) {
    return Response.json(
      { ok: false, error: "Demasiadas consultas, espera un momento" },
      { status: 429, headers: noStoreHeaders },
    );
  }

  const { searchParams } = new URL(request.url);
  const invitedAs = (searchParams.get("invitedAs") || searchParams.get("para") || searchParams.get("invitado") || "").trim();

  if (!invitedAs) {
    return Response.json({ ok: false, error: "Falta invitación" }, { status: 400, headers: noStoreHeaders });
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ ok: true, persisted: false, rsvp: null }, { headers: noStoreHeaders });
  }

  try {
    // Lecturas independientes en paralelo: la respuesta guardada y el cupo de
    // acompañantes (antes iban en serie y duplicaban la latencia a Supabase).
    const [rsvpResult, invitationResult] = await Promise.allSettled([
      getRsvpByInvitation(invitedAs),
      getInvitationByLabel(invitedAs),
    ]);

    if (rsvpResult.status === "rejected") {
      throw rsvpResult.reason;
    }

    let allowedGuests: number | null = null;

    if (invitationResult.status === "fulfilled") {
      allowedGuests = invitationResult.value?.guestsPlanned ?? null;
    } else {
      // El cupo es opcional: sin él, el formulario solo permite 1 asistente.
      console.warn("[rsvp] no se pudo leer el cupo de la invitación:", invitationResult.reason);
    }

    return Response.json({ ok: true, persisted: true, rsvp: rsvpResult.value, allowedGuests }, { headers: noStoreHeaders });
  } catch (error) {
    console.error("[rsvp] error al leer:", error);
    return Response.json({ ok: false, error: "No se pudo leer" }, { status: 500, headers: noStoreHeaders });
  }
}
