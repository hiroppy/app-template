"use server";

import type { Item } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { prisma } from "../_clients/prisma";
import { type ItemSchema, itemSchema } from "../_schemas/items";
import { getFieldErrors } from "../_utils/zod";
import { getSessionOrReject } from "./auth";
import type { Result } from "./types";

type ReturnedCreate = Result<
  Pick<Item, "id" | "content" | "createdAt" | "updatedAt">
>;

export async function create(input: ItemSchema): Promise<ReturnedCreate> {
  const session = await getSessionOrReject();

  if (!session.success) {
    return session;
  }

  const { user } = session.data;
  const validatedFields = itemSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "invalid fields",
      zodErrors: getFieldErrors(validatedFields),
    };
  }

  const res = await prisma.$transaction(async (prisma) => {
    return await prisma.item.create({
      data: {
        content: validatedFields.data.content,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  });

  revalidateTag("items");

  return {
    success: true,
    data: {
      id: res.id,
      content: res.content,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    },
  };
}

export async function deleteAll() {
  const session = await getSessionOrReject();

  if (!session.success) {
    throw new Error("no session token");
  }

  const { user } = session.data;

  await prisma.$transaction(async (prisma) => {
    await prisma.item.deleteMany({
      where: {
        userId: user.id,
      },
    });
  });

  revalidateTag("items");
}
