"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  canRequestPreRevision,
  canRequestPostRevision,
} from "@/lib/revisions";
import { REVISION_LIMIT_MESSAGES } from "@/lib/constants";

export async function submitRevision(
  projectId: string,
  content: string,
  targetArea: string
) {
  // ログイン確認
  const user = await getCurrentUser();
  if (!user) redirect("/");

  // 案件取得（自分の案件のみ）
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { clientId: true, status: true, publishedAt: true },
  });

  if (!project || project.clientId !== user.id) {
    return { error: "案件が見つかりません。" };
  }

  // 公開前 / 公開後の判定
  const isPublished =
    project.status === "published" || project.status === "post_revising";
  const phase = isPublished ? "post" : "pre";

  // 回数チェック
  if (phase === "pre") {
    const check = await canRequestPreRevision(projectId);
    if (!check.allowed) {
      return { error: REVISION_LIMIT_MESSAGES.pre, limitReached: true };
    }
  } else {
    if (!project.publishedAt) {
      return { error: "公開日が不正です。" };
    }
    const check = await canRequestPostRevision(projectId, project.publishedAt);
    if (!check.allowed) {
      return { error: REVISION_LIMIT_MESSAGES.post, limitReached: true };
    }
  }

  // バリデーション
  if (!content.trim()) {
    return { error: "修正内容を入力してください。" };
  }

  // 通し番号を採番
  const seqNo =
    (await prisma.revision.count({ where: { projectId } })) + 1;

  // 修正依頼を保存
  await prisma.revision.create({
    data: {
      projectId,
      phase,
      seqNo,
      content,
      targetArea: targetArea || null,
      status: "open",
    },
  });

  // ステータスを更新
  await prisma.project.update({
    where: { id: projectId },
    data: { status: phase === "pre" ? "revising" : "post_revising" },
  });

  return { success: true };
}