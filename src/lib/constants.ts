export const MAX_PRE_REVISIONS = 3;
export const MAX_POST_REVISIONS_PER_YEAR = 2;
export const MAX_ASSET_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_MENU_ITEMS = 5;
export const MAX_PHOTOS_PER_MENU = 3;

export const REVISION_LIMIT_MESSAGES = {
  pre: "修正可能回数を超えています。",
  post: "修正可能回数を超えています。これ以上修正する場合は、お電話にてご案内します。",
} as const;