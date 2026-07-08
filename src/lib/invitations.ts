// Lista de invitaciones enviadas (los valores de "?para=").
// Acceso solo desde el servidor con la service role key (igual que rsvps.ts).

const SUPABASE_URL = process.env.SUPABASE_URL?.trim()
  .replace(/\/+$/, "")
  .replace(/\/rest\/v1$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const TABLE = "invitations";

export type InvitationInput = {
  label: string;
  guestsPlanned?: number | null;
  notes?: string | null;
};

export type InvitationRecord = InvitationInput & {
  id: string;
  created_at: string;
};

export function isInvitationsAvailable(): boolean {
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

export async function listInvitations(): Promise<InvitationRecord[]> {
  if (!isInvitationsAvailable()) {
    return [];
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?select=id,created_at,label,guests_planned,notes&order=label.asc`,
    { headers: restHeaders(), cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Error leyendo invitaciones (${response.status})`);
  }

  const rows = (await response.json()) as Array<{
    id: string;
    created_at: string;
    label: string;
    guests_planned: number | null;
    notes: string | null;
  }>;

  return rows.map((row) => ({
    id: row.id,
    created_at: row.created_at,
    label: row.label,
    guestsPlanned: row.guests_planned,
    notes: row.notes,
  }));
}

// Busca una invitación por su "para" (label), sin distinguir mayúsculas.
// Se usa para conocer el cupo de acompañantes (guests_planned) del invitado.
export async function getInvitationByLabel(label: string): Promise<InvitationRecord | null> {
  if (!isInvitationsAvailable() || !label.trim()) {
    return null;
  }

  // El label viene de la URL del invitado (?para=): se escapan los comodines
  // de LIKE para que un valor como "%" no coincida con cualquier invitación.
  const pattern = label.trim().replace(/([\\%_])/g, "\\$1");

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?select=id,created_at,label,guests_planned,notes&label=ilike.${encodeURIComponent(pattern)}&limit=1`,
    { headers: restHeaders(), cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Error leyendo invitación (${response.status})`);
  }

  const rows = (await response.json()) as Array<{
    id: string;
    created_at: string;
    label: string;
    guests_planned: number | null;
    notes: string | null;
  }>;

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    created_at: row.created_at,
    label: row.label,
    guestsPlanned: row.guests_planned,
    notes: row.notes,
  };
}

// Inserta un lote de invitaciones.
//
// mode controla qué pasa con un label que ya existe:
//   - "ignore": se deja intacto (no se pisa el cupo/notas que ya tuviera).
//     Es el modo para líneas importadas SIN cupo.
//   - "merge": se actualiza su cupo con el valor recibido. Solo se envían las
//     columnas label y guests_planned, así que las notas nunca se tocan.
export async function upsertInvitations(inputs: InvitationInput[], mode: "ignore" | "merge" = "ignore"): Promise<void> {
  if (!isInvitationsAvailable() || inputs.length === 0) {
    return;
  }

  // Todos los objetos del lote deben tener las mismas claves (PostgREST).
  const rows =
    mode === "merge"
      ? inputs.map((input) => ({ label: input.label, guests_planned: input.guestsPlanned ?? null }))
      : inputs.map((input) => ({ label: input.label }));

  const resolution = mode === "merge" ? "merge-duplicates" : "ignore-duplicates";

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=label`, {
    method: "POST",
    headers: restHeaders({ Prefer: `resolution=${resolution},return=minimal` }),
    body: JSON.stringify(rows),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Error guardando invitaciones (${response.status}): ${detail}`);
  }
}

// Actualiza el cupo de acompañantes de una invitación (null = sin cupo, en el
// formulario solo podrá confirmar 1 persona).
export async function updateInvitationGuests(id: string, guestsPlanned: number | null): Promise<void> {
  if (!isInvitationsAvailable()) {
    throw new Error("Supabase no está configurado");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: restHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify({ guests_planned: guestsPlanned }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Error actualizando cupo (${response.status}): ${detail}`);
  }
}

export async function deleteInvitation(id: string): Promise<void> {
  if (!isInvitationsAvailable()) {
    return;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: restHeaders({ Prefer: "return=minimal" }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error eliminando invitación (${response.status})`);
  }
}
