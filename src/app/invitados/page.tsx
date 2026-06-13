import type { Metadata } from "next";
import { cookies } from "next/headers";
import { INVITADOS_COOKIE, isInvitadosAuthed } from "@/lib/invitadosAuth";
import { isSupabaseConfigured, listRsvps, type RsvpRecord } from "@/lib/rsvp";
import { listInvitations, type InvitationRecord } from "@/lib/invitations";
import InvitadosDashboard from "./InvitadosDashboard";
import InvitadosLogin from "./InvitadosLogin";
import "./invitados.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de invitados",
  robots: { index: false, follow: false },
};

export default async function InvitadosPage() {
  const cookieStore = await cookies();
  const authed = isInvitadosAuthed(cookieStore.get(INVITADOS_COOKIE)?.value);

  if (!authed) {
    return (
      <main className="invitados-app invitados-app--center">
        <InvitadosLogin />
      </main>
    );
  }

  let rsvps: RsvpRecord[] = [];
  let invitations: InvitationRecord[] = [];
  let loadError = "";

  if (isSupabaseConfigured()) {
    // Independientes: si la tabla invitations aún no existe (schema viejo), las
    // respuestas se siguen mostrando.
    const [rsvpsResult, invitationsResult] = await Promise.allSettled([listRsvps(), listInvitations()]);

    if (rsvpsResult.status === "fulfilled") {
      rsvps = rsvpsResult.value;
    } else {
      loadError = "No se pudieron cargar las confirmaciones. Revisa la configuración de Supabase.";
    }

    if (invitationsResult.status === "fulfilled") {
      invitations = invitationsResult.value;
    } else if (!loadError) {
      loadError = "Las respuestas cargaron, pero falta la tabla de invitaciones. Ejecuta la versión más reciente de supabase/schema.sql.";
    }
  }

  return (
    <main className="invitados-app">
      <InvitadosDashboard
        rsvps={rsvps}
        invitations={invitations}
        supabaseConfigured={isSupabaseConfigured()}
        loadError={loadError}
      />
    </main>
  );
}
