// Límite de peticiones por cliente, en memoria.
//
// Best-effort: cada instancia del servidor lleva su propio conteo (en
// serverless puede haber varias), suficiente como freno de spam y de
// enumeración para el tráfico de una invitación de boda, sin depender de
// infraestructura extra.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

// true si `key` superó `limit` peticiones dentro de la ventana actual.
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      pruneExpired(now);
    }

    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

// IP del cliente detrás del proxy del hosting (primera de x-forwarded-for).
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    const [first] = forwarded.split(",");
    const ip = first?.trim();

    if (ip) {
      return ip;
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
