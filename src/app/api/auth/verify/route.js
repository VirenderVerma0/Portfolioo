import { userController } from "@/lib/controllers/userController";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = (req) => userController.verifyOTP(req);

// GET method for token verification
export const GET = async (req) => {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET || process.env.JWT_Secret;
    if (!jwtSecret) {
      return NextResponse.json({ success: false, error: "JWT secret not configured" }, { status: 500 });
    }
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }
};
