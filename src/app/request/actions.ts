"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { RequestFormInput } from "@/lib/types";

export async function submitRequest(data: RequestFormInput) {
  // ログイン確認
  const user = await getCurrentUser();
  if (!user) redirect("/");

  // 既に案件がある場合は弾く（1クライアント1案件）
  const existing = await prisma.project.findFirst({
    where: { clientId: user.id },
  });
  if (existing) {
    return { error: "既に制作依頼が登録されています。" };
  }

  // バリデーション（必須項目）
  const { basicInfo, menuItems } = data;
  if (
    !basicInfo.storeName.trim() ||
    !basicInfo.repName.trim() ||
    !basicInfo.phone.trim() ||
    !basicInfo.postalCode.trim() ||
    !basicInfo.address.trim()
  ) {
    return { error: "必須項目を入力してください。" };
  }
  if (!menuItems.some((item) => item.name.trim())) {
    return { error: "メニュー / プランを1つ以上入力してください。" };
  }

  // DBに保存
  await prisma.project.create({
    data: {
      clientId: user.id,
      status: "waiting",
      detail: {
        create: {
          storeName: basicInfo.storeName,
          repName: basicInfo.repName,
          phone: basicInfo.phone,
          postalCode: basicInfo.postalCode,
          address: basicInfo.address,
          nearestStation: basicInfo.nearestStation || null,
          businessHours: basicInfo.businessHours || null,
          holidays: basicInfo.holidays || null,
          otherInfo: basicInfo.otherInfo || null,
          concept: data.optional.concept || null,
          brandColor: data.optional.brandColor || null,
        },
      },
      menuItems: {
        create: menuItems
          .filter((item) => item.name.trim())
          .map((item, index) => ({
            sortOrder: index,
            name: item.name,
            priceText: item.priceText || null,
            description: item.description || null,
          })),
      },
      snsLinks: {
        create: data.snsLinks.map((sns) => ({
          platform: sns.platform,
          url: sns.url,
        })),
      },
    },
  });

  return { success: true };
}