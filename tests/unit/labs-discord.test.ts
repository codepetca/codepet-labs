import { describe, expect, it } from "vitest";

import {
  getDiscordDisplayName,
  getDiscordRoleNameForLabsUser,
  hasLinkedDiscordIdentity,
} from "../../src/lib/labs-discord";

describe("Labs Discord helpers", () => {
  it("detects whether a WorkOS user already has a linked Discord identity", () => {
    expect(
      hasLinkedDiscordIdentity({ metadata: { discordUserId: "1234567890" } }),
    ).toBe(true);
    expect(
      hasLinkedDiscordIdentity({ metadata: { discordUserId: "   " } }),
    ).toBe(false);
    expect(hasLinkedDiscordIdentity({ metadata: {} })).toBe(false);
  });

  it("chooses Discord roles for admins and builders", () => {
    expect(getDiscordRoleNameForLabsUser({ isAdmin: true })).toBe("Labs Admin");
    expect(getDiscordRoleNameForLabsUser({ isAdmin: false })).toBe("Builder");
  });

  it("prefers Discord global names when present", () => {
    expect(
      getDiscordDisplayName({
        discordGlobalName: "Stew",
        discordUsername: "armorup",
      }),
    ).toBe("Stew");
    expect(
      getDiscordDisplayName({
        discordGlobalName: null,
        discordUsername: "armorup",
      }),
    ).toBe("armorup");
  });
});
