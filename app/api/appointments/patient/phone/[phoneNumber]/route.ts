import { NextResponse } from "next/server";

// GET /api/appointments/patient/phone/[phoneNumber]
export async function GET(
  request: Request,
  { params }: { params: { phoneNumber: string } }
) {
  try {
    const { phoneNumber } = params;

    // TODO: Implement actual database query
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 