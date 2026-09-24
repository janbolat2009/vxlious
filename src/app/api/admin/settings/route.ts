import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany();
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const updated = await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, description: "Custom system setting" },
    });

    await logAdminAction({
      adminId: admin.id,
      action: "SETTING_CHANGED",
      targetType: "Setting",
      targetId: key,
      details: { key, value },
    });

    return NextResponse.json({ success: true, setting: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update setting" },
      { status: 500 }
    );
  }
}
