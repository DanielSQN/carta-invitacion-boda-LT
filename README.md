# Invitación de boda — Luisa & Jhonnatan

Invitación digital construida con Next.js. Una sola página con sobre animado,
secciones a pantalla completa, confirmación de asistencia (RSVP) guardada en
Supabase y un panel privado en `/invitados`.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Configuración (qué archivo cambiar para qué)

Copia `.env.example` a `.env.local` y completa los valores.

### 1. Enlace de la transmisión en vivo (YouTube)

- **Archivo:** `src/components/liveStream.ts`
- Cambia la constante `YOUTUBE_LIVE_URL` por el enlace de tu transmisión.
- Los **horarios** del día del evento (en que aparece el "en vivo") están en
  las constantes `WEDDING_LIVE_START` y `WEDDING_LIVE_END` (hora Colombia).
- La vista previa del "en vivo" está **apagada** (`FORCE_LIVE_PREVIEW = false`),
  así que el banner solo aparece el día de la boda. Para volver a verlo antes,
  pon esa constante en `true` o define `NEXT_PUBLIC_FORCE_LIVE=true`.

### 2. Confirmaciones (Supabase)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, ejecuta `supabase/schema.sql` (crea la tabla `rsvps`).
3. En **Project Settings → API**, copia:
   - `Project URL` → variable `SUPABASE_URL`
   - `service_role` key (secreta) → variable `SUPABASE_SERVICE_ROLE_KEY`
4. Define ambas en `.env.local` (y en las variables de entorno de tu hosting).

Mientras Supabase no esté configurado, el formulario sigue mostrando la
confirmación visual pero **no** guarda los datos (modo vista previa).

### 3. Panel privado `/invitados`

Dashboard tipo enterprise para los novios:

- **Métricas** (clic para filtrar): Respuestas (formularios recibidos),
  Asisten (dijeron que sí), Personas (total de asistentes), No asisten.
- **Filtros y búsqueda** por nombre, invitación o mensaje.
- **Exportar CSV** de las respuestas (respeta el filtro activo).
- **Invitaciones:** importa la lista de "para" a los que enviarás el link
  (una por línea, opcional `Nombre, cantidad`). El panel cruza cada
  invitación con las respuestas y marca *Pendiente / Confirmó / Declinó*, y
  genera el link `?para=` para copiar y enviar.
- Protegido con la clave `INVITADOS_PASSWORD` (definir en `.env.local`).
  Por defecto (sin definir) es `boda-lj-2026` — cámbiala en producción.

> Si ya habías creado la tabla `rsvps`, vuelve a ejecutar `supabase/schema.sql`
> (es idempotente) para crear también la tabla `invitations` que usa el
> control de invitaciones enviadas.

## Variables de entorno

| Variable | Dónde se usa | Descripción |
| --- | --- | --- |
| `SUPABASE_URL` | servidor | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | servidor | service role key (secreta) |
| `INVITADOS_PASSWORD` | servidor | clave del panel `/invitados` |
| `NEXT_PUBLIC_FORCE_LIVE` | cliente | `true`/`false` para forzar el "en vivo" |

## Build de producción

```bash
npm run build
npm run start
```
