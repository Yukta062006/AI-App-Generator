import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/auth/verify-otp
export async function POST(req: NextRequest) {
  const { email, code, markVerified } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
  }

  const record = await prisma.otpCode.findFirst({
    where: {
      email,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 401 });
  }

  // Mark code as used
  await prisma.otpCode.update({ where: { id: record.id }, data: { used: true } });

  // If this is a sign-up verification, mark the user as verified
  if (markVerified) {
    await prisma.user.update({
      where: { email },
      data: { isVerified: true, emailVerified: new Date() },
    });
  }

  return NextResponse.json({ success: true });
}
