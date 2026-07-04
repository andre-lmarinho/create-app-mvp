import { getServerSession } from "@repo/features/auth/lib/getServerSession";
import { redirect } from "next/navigation";

import AppView from "~/app/AppView";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <AppView />;
}
