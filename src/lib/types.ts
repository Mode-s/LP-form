// 制作依頼フォームが扱うデータの型定義


// SNS / 既存ウェブサイト
export type SnsPlatform = 'instagram' | 'x' | 'line' | 'facebook' | 'website';

export interface SnsLinkInput {
  platform: SnsPlatform;
  url: string;
}

// 画像素材
export interface ImageInput {
  id: string; // 画面内で一意に扱うためのID
  fileName: string; // 表示用のファイル名
  previewUrl: string;
  sizeBytes: number;
}

// メニュー / プラン
export interface MenuItemInput {
  id: string;
  name: string;
  priceText: string;
  description: string;
  photos: ImageInput[];
}

// 基本情報
export interface BasicInfoInput {
  storeName: string;
  repName: string;
  phone: string;
  postalCode: string;
  address: string;
  nearestStation: string;
  businessHours: string; // 営業時間
  holidays: string; // 定休日
  otherInfo: string; // その他記載したい内容
}

// ご希望があれば
export interface OptionalInput {
  concept: string;
  brandColor: string;
}

// フォーム全体
// 上記全てを束ねたデータ
export interface RequestFormInput {
  basicInfo: BasicInfoInput;
  snsLinks: SnsLinkInput[];
  menuItems: MenuItemInput[];
  logo: ImageInput | null;
  otherAssets: ImageInput[];
  optional: OptionalInput;
}

// --- ダッシュボード用 ---

// 案件のステータス（要件定義書 11.4 に対応）
export type ProjectStatus =
  | "waiting" // 制作待ち
  | "in_production" // 制作中
  | "draft_submitted" // 初稿提出済み
  | "revising" // 修正中
  | "publish_waiting" // 公開待ち
  | "published" // 公開済み
  | "post_revising" // 公開後修正中
  | "suspended"; // 公開停止

// ステータスの表示名とカラーの定義
export const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bgColor: string }
> = {
  waiting: { label: "制作待ち", color: "#92610a", bgColor: "#fef3c7" },
  in_production: { label: "制作中", color: "#1d4ed8", bgColor: "#dbeafe" },
  draft_submitted: { label: "初稿提出済み", color: "#6d28d9", bgColor: "#ede9fe" },
  revising: { label: "修正中", color: "#b45309", bgColor: "#fef3c7" },
  publish_waiting: { label: "公開待ち", color: "#0f766e", bgColor: "#ccfbf1" },
  published: { label: "公開済み", color: "#166534", bgColor: "#dcfce7" },
  post_revising: { label: "公開後修正中", color: "#0f766e", bgColor: "#ccfbf1" },
  suspended: { label: "公開停止", color: "#991b1b", bgColor: "#fee2e2" },
};

// 案件データ（ダッシュボード表示用）
export interface ProjectSummary {
  id: string;
  storeName: string; // 店舗名 / 企業名
  status: ProjectStatus;
  createdAt: string; // 依頼日
}

// --- 案件詳細用 ---

// 修正依頼1件
export interface RevisionSummary {
  id: string;
  seqNo: number; // 案件内の通し番号
  phase: "pre" | "post"; // 公開前 / 公開後
  content: string; // 修正内容
  targetArea: string; // 該当箇所
  status: "open" | "done"; // 対応中 / 完了
  createdAt: string;
}

// 案件詳細データ
export interface ProjectDetail {
  id: string;
  storeName: string;
  status: ProjectStatus;
  createdAt: string;
  previewUrl: string | null; // 初稿URL。制作中はnull。
  revisions: RevisionSummary[];
}