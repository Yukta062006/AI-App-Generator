import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/email";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/signup
export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Check if already registered
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.isVerified) {
    return NextResponse.json(
      { error: "This email is already registered. Please login instead." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Upsert — allow re-registration if previous attempt was unverified
  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, name: name || email.split("@")[0], isVerified: false },
    create: {
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
      isVerified: false,
    },
  });

  // Invalidate old OTPs and send fresh one
  await prisma.otpCode.updateMany({ where: { email, used: false }, data: { used: true } });
  const code = generateOtp();
  await prisma.otpCode.create({
    data: { email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  });

  try {
    await sendOtpEmail(email, code);
  } catch (err) {
    console.error("Signup OTP send failed:", err);
    return NextResponse.json({ error: "Failed to send OTP. Check SMTP config." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
