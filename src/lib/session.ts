import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ログイン中のユーザーをDBから取得する
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  return user;
}