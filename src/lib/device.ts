// Detección de equipos de bajo rendimiento (gama baja). Se usa para activar el
// "modo lite": transición del sobre simplificada, sin partículas, sin parallax
// de scroll y sin backdrop-filter (el desenfoque es costoso en GPUs viejas).
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const cores = navigator.hardwareConcurrency || 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;

  return cores <= 4 || memory <= 4;
}
