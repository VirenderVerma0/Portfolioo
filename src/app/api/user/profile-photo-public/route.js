import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await connectDB();

    // Assuming there's a single user or a default user for the portfolio
    // You might need to adjust this based on your user setup
    const user = await User.findOne({}); // Fetch the first user or adjust as needed

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profilePhoto: user.profilePhoto
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch profile photo" }, { status: 500 });
  }
};
