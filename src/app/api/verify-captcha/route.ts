import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  const secretKey = process.env.CAPTCHA_SECRET_KEY;

  const verificationResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: "POST" },
  );

  const verificationResult = await verificationResponse.json();

  if (verificationResult.success && verificationResult.score >= 0.5) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({
    success: false,
    score: verificationResult.score,
    error: verificationResult["error-codes"],
  });
}
