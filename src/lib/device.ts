// Detección de equipos de bajo rendimiento (gama baja). Se usa para activar el
// "modo lite": transición del sobre simplificada, sin partículas, sin parallax
// de scroll y sin backdrop-filter (el desenfoque es costoso en GPUs viejas).
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const cores = navigator.hardwareConcurrency || 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;

  // Criterio conservador: solo equipos realmente débiles (pocos núcleos Y poca
  // memoria). Muchos celulares normales tienen 4 núcleos o reportan 4 GB (el
  // valor está limitado por privacidad), así que se exige que ambos sean bajos
  // para no degradar la experiencia en gama media.
  return cores <= 4 && memory <= 4;
}
