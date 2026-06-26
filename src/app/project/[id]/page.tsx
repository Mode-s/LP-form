"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { mockProjectDetail } from "@/lib/mock-data";
import { STATUS_CONFIG } from "@/lib/types";
import type { ProjectDetail, ProjectStatus } from "@/lib/types";

// モック確認用: 切り替えられるステータス一覧
const MOCK_STATUSES: ProjectStatus[] = [
  "draft_submitted",
  "revising",
  "publish_waiting",
  "published",
];

export default function ProjectDetailPage() {
  const [status, setStatus] = useState<ProjectStatus>(
    mockProjectDetail.status
  );

  // 現在のステータスをモックデータに反映
  const project: ProjectDetail = { ...mockProjectDetail, status };

  // ステータスに応じてアクションボタンの表示を決める
  const showActions = status === "draft_submitted";
  const showRevisionButton =
    status === "draft_submitted" || status === "published";

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* 戻るリンク */}
        <Link href="/dashboard" className={styles.back}>
          ← ダッシュボードへ戻る
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>{project.storeName}</h1>
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

        {/* モック確認用の切り替え */}
        <div className={styles.mockToggle}>
          <span className={styles.mockLabel}>【モック確認用】ステータス切り替え:</span>
          <div className={styles.mockButtons}>
            {MOCK_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={`${styles.toggleButton} ${status === s ? styles.active : ""}`}
                onClick={() => setStatus(s)}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* 初稿URL */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>初稿プレビュー</h2>
          {project.previewUrl ? (
            <a
              href={project.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.previewLink}
            >
              {project.previewUrl} ↗
            </a>
          ) : (
            <p className={styles.empty}>
              まだ初稿が届いていません。制作完了までお待ちください。
            </p>
          )}
        </section>

        {/* 修正履歴 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>修正履歴</h2>
          {project.revisions.length > 0 ? (
            <ul className={styles.revisionList}>
              {project.revisions.map((rev) => (
                <li key={rev.id} className={styles.revisionItem}>
                  <div className={styles.revisionHeader}>
                    <span className={styles.revisionNo}>
                      修正依頼 {rev.seqNo}回目
                      （{rev.phase === "pre" ? "公開前" : "公開後"}）
                    </span>
                    <span
                      className={`${styles.revisionStatus} ${
                        rev.status === "done"
                          ? styles.revisionDone
                          : styles.revisionOpen
                      }`}
                    >
                      {rev.status === "done" ? "対応済み" : "対応中"}
                    </span>
                  </div>
                  {rev.targetArea && (
                    <p className={styles.revisionArea}>
                      該当箇所: {rev.targetArea}
                    </p>
                  )}
                  <p className={styles.revisionContent}>{rev.content}</p>
                  <p className={styles.revisionDate}>{rev.createdAt}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>修正履歴はありません。</p>
          )}
        </section>

        {/* アクションボタン（初稿提出済みのときのみ表示） */}
        {showActions && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>確認結果</h2>
            <p className={styles.actionNote}>
              初稿をご確認いただき、修正依頼または完了をお選びください。
            </p>
            <div className={styles.actions}>
              <Link
                href={`/project/${project.id}/revision`}
                className={styles.revisionButton}
              >
                修正依頼をする
              </Link>
              <button type="button" className={styles.completeButton}>
                完了にする
              </button>
            </div>
          </section>
        )}

        {/* 公開済みのときは公開後修正ボタンを表示 */}
        {status === "published" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>公開後の修正</h2>
            <p className={styles.actionNote}>
              軽微なテキスト修正のみ対応可能です（年2回まで）。
            </p>
            <Link
              href={`/project/${project.id}/revision`}
              className={styles.revisionButton}
            >
              修正依頼をする
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}