import { getServerSession } from "@repo/features/auth/lib/getServerSession";
import { WWW_URL } from "@repo/lib/urls";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession();

  return Response.json(
    { authenticated: Boolean(session) },
    {
      headers: {
        "cache-control": "private, no-store",
        "access-control-allow-origin": WWW_URL,
        "access-control-allow-credentials": "true",
        vary: "Origin",
      },
    }
  );
}
