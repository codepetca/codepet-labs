"use server";

import { revalidatePath } from "next/cache";

import {
  getLabsConfig,
  getWorkOSClient,
  requireLabsAdmin,
} from "@/lib/labs-admin";

export async function approveUser(formData: FormData) {
  await requireLabsAdmin();

  const userId = getFormValue(formData, "userId");
  const config = getLabsConfig();
  const workos = getWorkOSClient();

  await workos.userManagement.createOrganizationMembership({
    organizationId: config.orgId,
    userId,
    roleSlug: config.studentRoleSlug,
  });

  await workos.userManagement.updateUser({
    userId,
    metadata: {
      labsStatus: "approved",
      labsApprovedAt: new Date().toISOString(),
    },
  });

  revalidatePath("/admin");
}

export async function markNotNow(formData: FormData) {
  await requireLabsAdmin();

  const userId = getFormValue(formData, "userId");

  await getWorkOSClient().userManagement.updateUser({
    userId,
    metadata: {
      labsStatus: "not_now",
    },
  });

  revalidatePath("/admin");
}

export async function restorePotentialUser(formData: FormData) {
  await requireLabsAdmin();

  const userId = getFormValue(formData, "userId");

  await getWorkOSClient().userManagement.updateUser({
    userId,
    metadata: {
      labsStatus: "pending",
    },
  });

  revalidatePath("/admin");
}

export async function deactivateMember(formData: FormData) {
  await requireLabsAdmin();

  const membershipId = getFormValue(formData, "membershipId");

  await getWorkOSClient().userManagement.deactivateOrganizationMembership(
    membershipId,
  );

  revalidatePath("/admin");
}

export async function reactivateMember(formData: FormData) {
  await requireLabsAdmin();

  const membershipId = getFormValue(formData, "membershipId");

  await getWorkOSClient().userManagement.reactivateOrganizationMembership(
    membershipId,
  );

  revalidatePath("/admin");
}

export async function setMemberRole(formData: FormData) {
  await requireLabsAdmin();

  const membershipId = getFormValue(formData, "membershipId");
  const roleSlug = getFormValue(formData, "roleSlug");

  await getWorkOSClient().userManagement.updateOrganizationMembership(
    membershipId,
    { roleSlug },
  );

  revalidatePath("/admin");
}

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing ${key}`);
  }

  return value.trim();
}
