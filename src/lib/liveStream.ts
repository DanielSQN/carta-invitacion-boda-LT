// Configuracion de la transmision en vivo del evento.
//
// El enlace de YouTube se reemplaza cuando este disponible.
export const YOUTUBE_LIVE_URL = "https://www.youtube.com/";

// Ventana en que se considera "en vivo" (hora de Colombia, UTC-5).
export const WEDDING_LIVE_START = new Date("2026-09-26T14:00:00-05:00");
export const WEDDING_LIVE_END = new Date("2026-09-27T02:00:00-05:00");

// Vista previa: deja el banner/indicador visibles ANTES del dia del evento.
// Apagado para produccion: el "en vivo" solo aparece el dia de la boda.
// Para reactivar la vista previa: pon true, o define NEXT_PUBLIC_FORCE_LIVE=true.
const FORCE_LIVE_PREVIEW = false;

export function isLiveNow(now: Date = new Date()): boolean {
  const env = process.env.NEXT_PUBLIC_FORCE_LIVE;

  if (env === "true") {
    return true;
  }

  if (env === "false") {
    return false;
  }

  if (FORCE_LIVE_PREVIEW) {
    return true;
  }

  return now >= WEDDING_LIVE_START && now <= WEDDING_LIVE_END;
}
