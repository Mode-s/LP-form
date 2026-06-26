import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { STATUS_CONFIG } from "@/lib/types";

export default async function DashboardPage() {
  // ログイン中のユーザーを取得
  const user = await getCurrentUser();
  if (!user) redirect("/");

  // そのユーザーの案件を取得
  const project = await prisma.project.findFirst({
    where: { clientId: user.id },
    include: { detail: true },
  });

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ダッシュボード</h1>

        {project && project.detail ? (
          /* 案件あり */
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.storeName}>{project.detail.storeName}</h2>
              <span
                className={styles.statusBadge}
                style={{
                  color: STATUS_CONFIG[project.status].color,
                  backgroundColor: STATUS_CONFIG[project.status].bgColor,
                }}
              >
                {STATUS_CONFIG[project.status].label}
              </span>
            </div>
            <p className={styles.createdAt}>
              依頼日: {project.createdAt.toLocaleDateString("ja-JP")}
            </p>
            <Link
              href={`/project/${project.id}`}
              className={styles.detailLink}
            >
              案件の詳細を確認する →
            </Link>
          </div>
        ) : (
          /* 案件なし */
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              まだ制作依頼がありません。
            </p>
            <Link href="/request" className={styles.requestButton}>
              制作依頼をする
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}