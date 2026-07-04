import { auth } from "@repo/features/auth/lib/auth";
import { headers } from "next/headers";

export interface Session {
  sessionId: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    name: string;
  };
}

export async function getServerSession(): Promise<Session | null> {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData) return null;

  const { session, user } = sessionData;

  return { sessionId: session.id, user };
}
