import { NextRequest, NextResponse } from "next/server";
import { authTokenName } from "./utils/constants";

export const config = {
  matcher: ["/chat"],
};

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get(authTokenName);
  if (tokenCookie && tokenCookie.value && tokenCookie.value !== "deleted") {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
