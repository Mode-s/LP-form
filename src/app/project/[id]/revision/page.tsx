"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { submitRevision } from "./actions";
import Link from "next/link";
import styles from "./page.module.css";
import ImageUploader from "@/app/request/_components/ImageUploader";
import type { ImageInput } from "@/lib/types";

// バリデーション
function validate(content: string): string[] {
  const errors: string[] = [];
  if (!content.trim()) errors.push("修正内容を入力してください。");
  return errors;
}

export default function RevisionPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [content, setContent] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [images, setImages] = useState<ImageInput[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    const newErrors = validate(content);
    setErrors(newErrors);

    if (newErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    const result = await submitRevision(projectId, content, targetArea);

    setIsSubmitting(false);

    if (result?.error) {
      setErrors([result.error]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitted(true);
  };

  // 送信完了画面
  if (isSubmitted) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.submitted}>
            <p className={styles.submittedIcon}>✓</p>
            <h1 className={styles.submittedTitle}>修正依頼を送信しました</h1>
            <p className={styles.submittedText}>
              内容を確認の上、担当者より修正版をご提出いたします。
            </p>
            <Link href="/dashboard" className={styles.backButton}>
              ダッシュボードへ戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* 戻るリンク */}
        <Link href="/dashboard" className={styles.back}>
          ← 案件詳細へ戻る
        </Link>

        <h1 className={styles.title}>修正依頼</h1>
        <p className={styles.lead}>
          修正してほしい内容を入力してください。
        </p>

        {/* エラー表示 */}
        {errors.length > 0 && (
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>入力内容を確認してください</p>
            <ul className={styles.errorList}>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.card}>
          {/* 修正内容 */}
          <div className={styles.field}>
            <label className={styles.label}>
              修正内容<span className={styles.required}>必須</span>
            </label>
            <textarea
              className={styles.textarea}
              rows={5}
              placeholder="例: ヘッダーのキャッチコピーを「〇〇」に変更してほしい"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 該当箇所 */}
          <div className={styles.field}>
            <label className={styles.label}>該当箇所</label>
            <input
              type="text"
              className={styles.input}
              placeholder="例: ヘッダー / ファーストビュー / メニューセクション"
              value={targetArea}
              onChange={(e) => setTargetArea(e.target.value)}
            />
          </div>

          {/* 参考画像 */}
          <div className={styles.field}>
            <label className={styles.label}>参考画像</label>
            <p className={styles.hint}>
              参考になる画像があれば添付してください（任意）。
            </p>
            <ImageUploader
              images={images}
              onChange={setImages}
              maxCount={5}
            />
          </div>
        </div>

        {/* 送信ボタン */}
        <div className={styles.submitArea}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "修正依頼を送信する"}
          </button>
        </div>
      </div>
    </main>
  );
}