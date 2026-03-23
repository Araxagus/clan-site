"use server";

import { prisma } from "@/lib/prisma";

export async function createPage(
  gameId: string,
  data: {
    key: string;
    label: string;
    category: string;
    subcategory: string;
    content?: any;
  }
) {
  return prisma.gamePage.create({
    data: {
      gameId,
      ...data,
      order: 0,
    },
  });
}

export async function updatePage(
  pageId: string,
  data: {
    key?: string;
    label?: string;
    category?: string;
    subcategory?: string;
    order?: number;
    content?: any;
  }
) {
  return prisma.gamePage.update({
    where: { id: pageId },
    data,
  });
}

export async function deletePage(pageId: string) {
  return prisma.gamePage.delete({
    where: { id: pageId },
  });
}
