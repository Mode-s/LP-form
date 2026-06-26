"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { mockProject, mockProjectNull } from "@/lib/mock-data";
import { STATUS_CONFIG } from "@/lib/types";
import type { ProjectSummary } from "@/lib/types";

export default function DashboardPage() {
  // モック確認用: true = 案件あり / false = 案件なし
  // 本番では削除し、APIから取得した値を使う
  const [showProject, setShowProject] = useState(true);

  const project: ProjectSummary | null = showProject
    ? mockProject
    : mockProjectNull;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ダッシュボード</h1>

        {/* モック確認用の切り替えボタン。本番では削除する */}
        <div className={styles.mockToggle}>
          <span className={styles.mockLabel}>【モック確認用】</span>
          <button
            type="button"
            className={`${styles.toggleButton} ${showProject ? styles.active : ""}`}
            onClick={() => setShowProject(true)}
          >
            案件あり
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${!showProject ? styles.active : ""}`}
            onClick={() => setShowProject(false)}
          >
            案件なし
          </button>
        </div>

        {project ? (
          /* 案件あり */
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.storeName}>{project.storeName}</h2>
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
            <p className={styles.createdAt}>依頼日: {project.createdAt}</p>
            <Link href={`/project/${project.id}`} className={styles.detailLink}>
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