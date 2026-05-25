import WeddingHome from "@/components/wedding-home/WeddingHome";

function normalizeGuestName(value: string) {
  let normalized = value;

  for (let index = 0; index < 2; index += 1) {
    try {
      normalized = decodeURIComponent(normalized);
    } catch {
      break;
    }
  }

  return normalized
    .replace(/\+/g, " ")
    .replace(/%20/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rawName = params.para || params.invitado;
  const initialGuestName =
    typeof rawName === "string" ? normalizeGuestName(rawName) : "Invitado Especial";

  return <WeddingHome initialGuestName={initialGuestName || "Invitado Especial"} />;
}
