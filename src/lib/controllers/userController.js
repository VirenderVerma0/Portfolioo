import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Setup Gmail Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // Ensuring variable names match your .env setup
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS, 
  },
});

export const userController = {
  // --- REGISTER & SEND OTP ---
  async register(req) {
    try {
      await connectDB();
      const { username, email, password } = await req.json();

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

      await User.create({
        username,
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
        role: 'user'
      });

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Your Portfolio Admin OTP",
        html: `<h1>Verification Code</h1><p>Your code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
      });

      return NextResponse.json({ success: true, message: "OTP sent to Gmail" }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  },

  // --- VERIFY OTP ---
  async verifyOTP(req) {
    try {
      await connectDB();
      const { email, otp, isPasswordReset } = await req.json();

      let user;
      if (isPasswordReset) {
        // For password reset verification
        user = await User.findOne({
          email,
          resetOtp: otp,
          resetOtpExpires: { $gt: Date.now() }
        });
      } else {
        // For account verification
        user = await User.findOne({
          email,
          otp,
          otpExpires: { $gt: Date.now() }
        });
      }

      if (!user) {
        return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
      }

      if (isPasswordReset) {
        // For password reset, just verify the OTP is valid (don't clear it yet)
        return NextResponse.json({ success: true, message: "OTP verified successfully" }, { status: 200 });
      } else {
        // For account verification, mark as verified and clear OTP
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return NextResponse.json({ success: true, message: "Account verified successfully" }, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
    }
  },

  // --- LOGIN ---
  async login(req) {
    try {
      await connectDB();
      const { email, password } = await req.json();

      // Find user and explicitly select password because 'select: false' is usually in the Schema
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
      }

      if (!user.isVerified) {
        return NextResponse.json({ success: false, error: "Please verify your email first" }, { status: 403 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
      }

      // Generate JWT Token
      const jwtSecret = process.env.JWT_SECRET || process.env.JWT_Secret;
      const token = jwt.sign(
        { id: user._id, role: user.role },
        jwtSecret,
        { expiresIn: "1d" }
      );

      return NextResponse.json({
        success: true,
        token,
        user: { username: user.username, email: user.email, role: user.role }
      }, { status: 200 });

    } catch (error) {
      // Return the real error message to aid debugging (can be sanitized later)
      return NextResponse.json({ success: false, error: error.message || "Login failed" }, { status: 500 });
    }
  },

  // --- FORGOT PASSWORD (SEND RESET OTP) ---
  async forgotPassword(req) {
    try {
      await connectDB();
      const { email } = await req.json();

      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }

      const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.resetOtp = resetOtp;
      user.resetOtpExpires = resetOtpExpires;
      await user.save();

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        html: `<h1>Password Reset</h1><p>Your reset code is: <strong>${resetOtp}</strong></p><p>It expires in 10 minutes.</p>`,
      });

      return NextResponse.json({ success: true, message: "Reset OTP sent to email" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  },

  // --- RESET PASSWORD ---
  async resetPassword(req) {
    try {
      await connectDB();
      const { email, otp, newPassword } = await req.json();

      const user = await User.findOne({
        email,
        resetOtp: otp,
        resetOtpExpires: { $gt: Date.now() }
      });

      if (!user) {
        return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      user.resetOtp = null;
      user.resetOtpExpires = null;
      await user.save();

      return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, error: "Password reset failed" }, { status: 500 });
    }
  },

  // --- UPDATE PROFILE PHOTO ---
  async updateProfilePhoto(req) {
    try {
      await connectDB();
      const { photoUrl } = await req.json();

      // Get user from token (assuming token is in headers)
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || process.env.JWT_Secret;
      const decoded = jwt.verify(token, jwtSecret);

      const user = await User.findById(decoded.id);
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }

      user.profilePhoto = photoUrl;
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Profile photo updated successfully",
        user: { username: user.username, email: user.email, role: user.role, profilePhoto: user.profilePhoto }
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, error: "Failed to update profile photo" }, { status: 500 });
    }
  }
};