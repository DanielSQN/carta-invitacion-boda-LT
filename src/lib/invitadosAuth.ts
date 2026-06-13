// Acceso al panel privado /invitados.
//
// Protegido por una clave (INVITADOS_PASSWORD). El login guarda una cookie
// httpOnly con la clave y la pagina la compara en el servidor.
//
// TODO: define INVITADOS_PASSWORD en produccion. El valor por defecto es solo
// para vista previa.
export const INVITADOS_COOKIE = "invitados_auth";

export function getInvitadosPassword(): string {
  return process.env.INVITADOS_PASSWORD?.trim() || "boda-lt-2026";
}

export function isInvitadosAuthed(cookieValue: string | undefined): boolean {
  return Boolean(cookieValue) && cookieValue === getInvitadosPassword();
}
