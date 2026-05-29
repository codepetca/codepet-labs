import { authkitProxy } from "@workos-inc/authkit-nextjs";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authkit = authkitProxy();

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!hasAuthkitProxyConfig()) {
    return NextResponse.next();
  }

  return authkit(request, event);
}

function hasAuthkitProxyConfig() {
  return Boolean(
    process.env.WORKOS_API_KEY &&
      process.env.WORKOS_CLIENT_ID &&
      process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI &&
      process.env.WORKOS_COOKIE_PASSWORD &&
      process.env.WORKOS_COOKIE_PASSWORD.length >= 32,
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
