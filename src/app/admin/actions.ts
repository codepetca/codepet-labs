"use server";

import { revalidatePath } from "next/cache";

import { requireLabsAdmin, updateLabsUserMetadata } from "@/lib/labs-admin";
import { removeDiscordMember, setDiscordBuilderRole } from "@/lib/labs-discord";

export async function approveUser(formData: FormData) {
  await requireLabsAdmin();

  const userId = getFormValue(formData, "userId");

  await updateLabsUserMetadata(userId, {
    labsStatus: "approved",
    labsRole: "builder",
    labsApprovedAt: new Date().toISOString(),
  });

  revalidatePath("/admin");
}

export async function markNotNow(formData: FormData) {
  await requireLabsAdmin();

  const userId = getFormValue(formData, "userId");

  await updateLabsUserMetadata(userId, {
    labsStatus: "not_now",
  });

  revalidatePath("/admin");
}

export async function restorePotentialUser(formData: FormData) {
  await requireLabsAdmin();

  const userId = getFormValue(formData, "userId");

  await updateLabsUserMetadata(userId, {
    labsStatus: "pending",
  });

  revalidatePath("/admin");
}

export async function pauseBuilder(formData: FormData) {
  await requireLabsAdmin();

  const userId = getFormValue(formData, "userId");
  const discordUserId = getOptionalFormValue(formData, "discordUserId");
  const nextMetadata: Record<string, string> = {
    labsStatus: "inactive",
  };

  if (discordUserId) {
    const result = await setDiscordBuilderRole(discordUserId, false);

    nextMetadata.discordLastRoleSyncResult = result;
    nextMetadata.discordRoleSyncedAt = new Date().toISOString();
  }

  await updateLabsUserMetadata(userId, nextMetadata);

  revalidatePath("/admin");
}

export async function reactivateBuilder(formData: FormData) {
  await requireLabsAdmin();

  const userId = getFormValue(formData, "userId");
  const discordUserId = getOptionalFormValue(formData, "discordUserId");
  const nextMetadata: Record<string, string> = {
    labsStatus: "approved",
    labsRole: "builder",
  };

  if (discordUserId) {
    const result = await setDiscordBuilderRole(discordUserId, true);

    nextMetadata.discordLastRoleSyncResult = result;
    nextMetadata.discordRoleSyncedAt = new Date().toISOString();
  }

  await updateLabsUserMetadata(userId, nextMetadata);

  revalidatePath("/admin");
}

export async function removeBuilderFromDiscord(formData: FormData) {
  await requireLabsAdmin();

  const userId = getFormValue(formData, "userId");
  const discordUserId = getOptionalFormValue(formData, "discordUserId");

  const result = await removeDiscordMember(discordUserId);
  const nextMetadata: Record<string, string> = {
    discordLastRemovalResult: result,
  };

  if (result === "ok" || result === "not_in_server") {
    nextMetadata.discordRemovedAt = new Date().toISOString();
  }

  await updateLabsUserMetadata(userId, nextMetadata);

  revalidatePath("/admin");
}

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing ${key}`);
  }

  return value.trim();
}

function getOptionalFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" && value.trim() ? value.trim() : null;
}
