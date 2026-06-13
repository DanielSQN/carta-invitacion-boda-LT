import { cookies } from "next/headers";
import { getInvitadosPassword, INVITADOS_COOKIE } from "@/lib/invitadosAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let password = "";

  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (password !== getInvitadosPassword()) {
    return Response.json({ ok: false, error: "Clave incorrecta" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(INVITADOS_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return Response.json({ ok: true });
}
