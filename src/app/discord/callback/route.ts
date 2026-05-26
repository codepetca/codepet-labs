import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  getCurrentLabsUser,
  isAdminEmail,
  updateLabsUserMetadata,
} from "@/lib/labs-admin";
import {
  exchangeDiscordCode,
  fetchDiscordUser,
  joinDiscordGuildWithBuilderRole,
} from "@/lib/labs-discord";

const DISCORD_STATE_COOKIE = "codepet_discord_oauth_state";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(DISCORD_STATE_COOKIE)?.value;

  cookieStore.delete(DISCORD_STATE_COOKIE);

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/hub?discord=error", request.url));
  }

  const user = await getCurrentLabsUser();
  const isAllowed =
    user.metadata.labsStatus === "approved" || isAdminEmail(user.email);

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  try {
    const accessToken = await exchangeDiscordCode(code);
    const discordUser = await fetchDiscordUser(accessToken);

    await updateLabsUserMetadata(user.id, {
      discordGlobalName: discordUser.globalName ?? "",
      discordLinkedAt: new Date().toISOString(),
      discordRemovedAt: "",
      discordUserId: discordUser.id,
      discordUsername: discordUser.username,
    });

    await joinDiscordGuildWithBuilderRole({
      accessToken,
      discordUserId: discordUser.id,
    });

    return NextResponse.redirect(new URL("/hub?discord=linked", request.url));
  } catch (error) {
    console.error("[Discord link error]", error);
    return NextResponse.redirect(new URL("/hub?discord=error", request.url));
  }
}
