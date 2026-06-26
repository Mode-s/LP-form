import { prisma } from "@/lib/prisma";
import {
  MAX_PRE_REVISIONS,
  MAX_POST_REVISIONS_PER_YEAR,
} from "@/lib/constants";

// 公開前の修正回数を数える
export async function countPreRevisions(projectId: string): Promise<number> {
  return prisma.revision.count({
    where: { projectId, phase: "pre" },
  });
}

// 公開日からの1年区間の開始日を返す
export function currentYearWindowStart(publishedAt: Date, now: Date): Date {
  const start = new Date(publishedAt);
  let yearsElapsed = now.getFullYear() - start.getFullYear();
  const anniversaryThisYear = new Date(start);
  anniversaryThisYear.setFullYear(start.getFullYear() + yearsElapsed);
  if (anniversaryThisYear > now) yearsElapsed -= 1;
  const windowStart = new Date(start);
  windowStart.setFullYear(start.getFullYear() + Math.max(0, yearsElapsed));
  return windowStart;
}

// 公開後・直近1年の修正回数を数える
export async function countPostRevisionsInCurrentYear(
  projectId: string,
  publishedAt: Date,
  now: Date = new Date()
): Promise<number> {
  const windowStart = currentYearWindowStart(publishedAt, now);
  return prisma.revision.count({
    where: {
      projectId,
      phase: "post",
      createdAt: { gte: windowStart },
    },
  });
}

// 公開前に修正依頼を出せるか
export async function canRequestPreRevision(
  projectId: string
): Promise<{ allowed: boolean; current: number; max: number }> {
  const current = await countPreRevisions(projectId);
  return {
    allowed: current < MAX_PRE_REVISIONS,
    current,
    max: MAX_PRE_REVISIONS,
  };
}

// 公開後に修正依頼を出せるか
export async function canRequestPostRevision(
  projectId: string,
  publishedAt: Date
): Promise<{ allowed: boolean; current: number; max: number }> {
  const current = await countPostRevisionsInCurrentYear(projectId, publishedAt);
  return {
    allowed: current < MAX_POST_REVISIONS_PER_YEAR,
    current,
    max: MAX_POST_REVISIONS_PER_YEAR,
  };
}