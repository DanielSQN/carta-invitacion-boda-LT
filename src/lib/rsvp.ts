// Persistencia de confirmaciones (RSVP) en Supabase.
//
// Todo el acceso a Supabase ocurre EN EL SERVIDOR con la service role key, asi
// que el navegador nunca habla directo con la base de datos: el formulario
// envia a /api/rsvp y la pagina /invitados lee del servidor.
//
// Variables de entorno necesarias (ver README y .env.example):
//   SUPABASE_URL                 URL del proyecto Supabase
//   SUPABASE_SERVICE_ROLE_KEY    service role key (secreta, solo servidor)

// Acepta tanto la URL base (https://xxx.supabase.co) como el endpoint REST
// (https://xxx.supabase.co/rest/v1) — se normaliza a la base.
const SUPABASE_URL = process.env.SUPABASE_URL?.trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const TABLE = "rsvps";

export type RsvpInput = {
  attending: boolean;
  guestCount: number;
  names: string[];
  invitedAs?: string | null;
  message?: string | null;
};

export type RsvpRecord = RsvpInput & {
  id: string;
  created_at: string;
};

type RsvpRow = {
  id: string;
  created_at: string;
  attending: boolean;
  guest_count: number;
  names: string[] | null;
  invited_as: string | null;
  message: string | null;
};

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function restHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY as string,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function insertRsvp(input: RsvpInput): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado");
  }

  const invitedAs = input.invitedAs?.trim() || null;

  const row = {
    attending: input.attending,
    guest_count: input.guestCount,
    names: input.names,
    invited_as: invitedAs,
    message: input.message ?? null,
  };

  // Re-confirmación: primero se inserta la respuesta nueva y SOLO después se
  // limpian las anteriores de la misma invitación. Con el orden inverso
  // (borrar primero), un fallo del insert dejaba al invitado sin respuesta
  // guardada. Si la limpieza falla queda un duplicado viejo, que es inofensivo:
  // la lectura toma siempre la más reciente (order=created_at.desc&limit=1).
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: restHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Error guardando RSVP (${response.status}): ${detail}`);
  }

  if (!invitedAs) {
    return;
  }

  const inserted = ((await response.json().catch(() => [])) as Array<{ id?: string }>)[0];

  if (!inserted?.id) {
    return;
  }

  const cleanup = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?invited_as=eq.${encodeURIComponent(invitedAs)}&id=neq.${encodeURIComponent(inserted.id)}`,
    { method: "DELETE", headers: restHeaders({ Prefer: "return=minimal" }), cache: "no-store" },
  );

  if (!cleanup.ok) {
    // No se lanza: la respuesta nueva ya quedó guardada y es la que se lee.
    console.warn(`[rsvp] no se pudieron limpiar respuestas anteriores (${cleanup.status})`);
  }
}

function mapRsvpRow(row: RsvpRow): RsvpRecord {
  return {
    id: row.id,
    created_at: row.created_at,
    attending: row.attending,
    guestCount: row.guest_count,
    names: row.names ?? [],
    invitedAs: row.invited_as,
    message: row.message,
  };
}

export async function getRsvpByInvitation(invitedAs: string): Promise<RsvpRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const label = invitedAs.trim();

  if (!label) {
    return null;
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?select=id,created_at,attending,guest_count,names,invited_as,message&invited_as=eq.${encodeURIComponent(label)}&order=created_at.desc&limit=1`,
    {
      headers: restHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Error leyendo RSVP (${response.status}): ${detail}`);
  }

  const rows = (await response.json()) as RsvpRow[];
  const [row] = rows;

  return row ? mapRsvpRow(row) : null;
}

export async function listRsvps(): Promise<RsvpRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?select=id,created_at,attending,guest_count,names,invited_as,message&order=created_at.desc`,
    {
      headers: restHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Error leyendo RSVP (${response.status}): ${detail}`);
  }

  const rows = (await response.json()) as RsvpRow[];

  return rows.map(mapRsvpRow);
}
