import type { ProjectSummary, ProjectDetail } from "./types";

// ダッシュボード用
export const mockProject: ProjectSummary = {
  id: "project-001",
  storeName: "サンプル店舗",
  status: "draft_submitted",
  createdAt: "2026-06-01",
};

export const mockProjectNull = null;

// 案件詳細用
export const mockProjectDetail: ProjectDetail = {
  id: "project-001",
  storeName: "サンプル店舗",
  status: "draft_submitted",
  createdAt: "2026-06-01",
  previewUrl: "https://example.com/lp-preview",
  revisions: [
    {
      id: "rev-001",
      seqNo: 1,
      phase: "pre",
      content: "ヘッダーの文字を大きくしてほしい",
      targetArea: "ヘッダー部分",
      status: "done",
      createdAt: "2026-06-05",
    },
  ],
};