import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Auth pages that don't require authentication
  const authPages = ["/signin", "/SignUp", "/VerifyOTP", "/ForgotPassword", "/ResetPassword"];

  // If it's an auth page, allow access
  if (authPages.includes(pathname)) {
    return NextResponse.next();
  }

  // For API routes
  if (pathname.startsWith("/api")) {
    // Auth APIs should be accessible without authentication
    const authAPIs = ["/api/auth/register", "/api/auth/login", "/api/auth/verify", "/api/auth/forgot-password", "/api/auth/reset-password", "/api/contact"];

    // Allow like endpoint for all visitors (no authentication required)
    if (pathname.match(/^\/api\/projects\/[^\/]+\/like$/)) {
      return NextResponse.next(); // Allow like API without authentication
    }

    if (authAPIs.includes(pathname)) {
      return NextResponse.next(); // Allow auth APIs without authentication
    }

    // 1. Define which methods we want to protect
    // We allow GET (so people can see your portfolio)
    // but protect POST, PATCH, and DELETE
    const protectedMethods = ["POST", "PATCH", "DELETE"];

    if (protectedMethods.includes(request.method)) {
      // 2. Get the token from the Authorization header
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
      }

      try {
        // 3. Verify the token using the project's JWT secret
        // Use `JWT_Secret` to match the env variable used elsewhere in the codebase
        const secret = new TextEncoder().encode(process.env.JWT_Secret);
        const { payload } = await jwtVerify(token, secret);

        // Allow logged-in users to manage their portfolio (not just admins)
        return NextResponse.next(); // Token is valid, user is authenticated
      } catch (error) {
        return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 403 });
      }
    }

    return NextResponse.next();
  }

  // For admin pages, require authentication
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
    const secret = new TextEncoder().encode(process.env.JWT_Secret);
    const { payload } = await jwtVerify(token, secret);

      // Check if user is admin
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL("/", request.url)); // Redirect to portfolio if not admin
      }

      return NextResponse.next(); // Token is valid and user is admin
    } catch (error) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // For all other pages (portfolio pages), allow public access
  return NextResponse.next();
}

// Run middleware on all routes
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
