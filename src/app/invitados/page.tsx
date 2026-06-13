import type { Metadata } from "next";
import { cookies } from "next/headers";
import { INVITADOS_COOKIE, isInvitadosAuthed } from "@/lib/invitadosAuth";
import { isSupabaseConfigured, listRsvps, type RsvpRecord } from "@/lib/rsvp";
import InvitadosLogin from "./InvitadosLogin";
import "./invitados.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de invitados",
  robots: { index: false, follow: false },
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Bogota",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function Stats({ rsvps }: { rsvps: RsvpRecord[] }) {
  const yes = rsvps.filter((r) => r.attending);
  const no = rsvps.filter((r) => !r.attending);
  const people = yes.reduce((total, r) => total + (r.guestCount || r.names.length || 0), 0);

  return (
    <div className="invitados-stats">
      <div className="invitados-stat invitados-stat--yes">
        <strong>{yes.length}</strong>
        <span>Confirmaciones</span>
      </div>
      <div className="invitados-stat invitados-stat--people">
        <strong>{people}</strong>
        <span>Personas</span>
      </div>
      <div className="invitados-stat invitados-stat--no">
        <strong>{no.length}</strong>
        <span>No asisten</span>
      </div>
    </div>
  );
}

export default async function InvitadosPage() {
  const cookieStore = await cookies();
  const authed = isInvitadosAuthed(cookieStore.get(INVITADOS_COOKIE)?.value);

  if (!authed) {
    return (
      <main className="invitados-page invitados-page--center">
        <InvitadosLogin />
      </main>
    );
  }

  let rsvps: RsvpRecord[] = [];
  let loadError = "";

  if (isSupabaseConfigured()) {
    try {
      rsvps = await listRsvps();
    } catch {
      loadError = "No se pudieron cargar las confirmaciones. Revisa la configuración de Supabase.";
    }
  }

  return (
    <main className="invitados-page">
      <header className="invitados-header">
        <h1>Confirmaciones de invitados</h1>
        <form action="/api/invitados/logout" method="post">
          <button type="submit" className="invitados-logout">
            Salir
          </button>
        </form>
      </header>

      {!isSupabaseConfigured() ? (
        <p className="invitados-note">
          Supabase aún no está configurado. Define <code>SUPABASE_URL</code> y <code>SUPABASE_SERVICE_ROLE_KEY</code> para
          ver las confirmaciones. (Las nuevas confirmaciones todavía no se están guardando.)
        </p>
      ) : null}

      {loadError ? <p className="invitados-note invitados-note--error">{loadError}</p> : null}

      <Stats rsvps={rsvps} />

      {rsvps.length === 0 ? (
        <p className="invitados-empty">Aún no hay confirmaciones registradas.</p>
      ) : (
        <ul className="invitados-list">
          {rsvps.map((rsvp) => (
            <li key={rsvp.id} className={`invitados-item${rsvp.attending ? "" : " invitados-item--no"}`}>
              <div className="invitados-item-head">
                <span className={`invitados-tag${rsvp.attending ? "" : " invitados-tag--no"}`}>
                  {rsvp.attending ? "Asiste" : "No asiste"}
                </span>
                {rsvp.attending ? <span className="invitados-count">{rsvp.guestCount} pers.</span> : null}
                <time className="invitados-date">{formatDate(rsvp.created_at)}</time>
              </div>
              <p className="invitados-names">{rsvp.names.join(", ")}</p>
              {rsvp.invitedAs ? <p className="invitados-meta">Invitación: {rsvp.invitedAs}</p> : null}
              {rsvp.message ? <p className="invitados-message">“{rsvp.message}”</p> : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
