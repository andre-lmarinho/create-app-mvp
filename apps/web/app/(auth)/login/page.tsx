import { getServerSession } from "@repo/features/auth/lib/getServerSession";
import { redirect } from "next/navigation";

import { LoginView } from "~/auth/LoginView";

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return <LoginView />;
}
