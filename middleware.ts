import { NextRequest, NextResponse } from "next/server";
import { authTokenName } from "./utils/constants";

export const config = {
  matcher: ["/chat", "/"],
};

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get(authTokenName);
  const isAuthenticated =
    tokenCookie && tokenCookie.value && tokenCookie.value !== "deleted";
  const { pathname } = request.nextUrl;

  if (isAuthenticated) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
    return NextResponse.next();
  } else {
    if (pathname === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }
}
