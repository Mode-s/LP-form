"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function completeProject(projectId: string) {
  // ログイン確認
  const user = await getCurrentUser();
  if (!user) redirect("/");

  // 案件取得（自分の案件のみ）
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { clientId: true, status: true },
  });

  if (!project || project.clientId !== user.id) {
    return { error: "案件が見つかりません。" };
  }

  // 初稿提出済みのときのみ完了にできる
  if (project.status !== "draft_submitted") {
    return { error: "現在のステータスでは完了にできません。" };
  }

  // ステータスを公開待ちへ
  await prisma.project.update({
    where: { id: projectId },
    data: { status: "publish_waiting" },
  });

  return { success: true };
}