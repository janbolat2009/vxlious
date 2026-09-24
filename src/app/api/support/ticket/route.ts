import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { category, subject, message } = body;

    if (!category || !subject || !message) {
      return NextResponse.json(
        { error: "Category, subject, and message are required." },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        category,
        subject,
        message,
        status: "open",
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Support Request Received",
        message: `Your ticket regarding "${subject}" (#${ticket.id.slice(-6)}) has been received.`,
        type: "info",
        link: "/support",
      },
    });

    return NextResponse.json({
      message: "Ticket submitted successfully.",
      ticket,
    });
  } catch (error) {
    console.error("Support ticket error:", error);
    return NextResponse.json(
      { error: "Failed to submit support ticket." },
      { status: 500 }
    );
  }
}
