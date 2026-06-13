import { cookies } from "next/headers";
import { INVITADOS_COOKIE } from "@/lib/invitadosAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(INVITADOS_COOKIE);
  return Response.json({ ok: true });
}
