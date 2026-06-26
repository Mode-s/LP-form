"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { completeProject } from "./actions";

type Props = {
  projectId: string;
};

export default function CompleteButton({ projectId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    if (!confirm("完了にしますか？この操作は取り消せません。")) return;

    setIsLoading(true);
    const result = await completeProject(projectId);
    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    // 完了後はページを再読み込みしてステータスを反映
    router.refresh();
  };

  return (
    <>
      {error && <p style={{ color: "#d14343", fontSize: "0.875rem" }}>{error}</p>}
      <button
        type="button"
        className={styles.completeButton}
        onClick={handleComplete}
        disabled={isLoading}
      >
        {isLoading ? "処理中..." : "完了にする"}
      </button>
    </>
  );
}