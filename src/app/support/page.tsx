import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { SupportClient } from "./SupportClient";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const user = await getCurrentUser();

  let tickets: Array<{
    id: string;
    category: string;
    subject: string;
    message: string;
    status: string;
    adminResponse: string | null;
    createdAt: string;
  }> = [];

  if (user) {
    const rawTickets = await prisma.supportTicket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    tickets = rawTickets.map((t) => ({
      id: t.id,
      category: t.category,
      subject: t.subject,
      message: t.message,
      status: t.status,
      adminResponse: t.adminResponse,
      createdAt: t.createdAt.toISOString(),
    }));
  }

  return <SupportClient initialTickets={tickets} userLoggedIn={!!user} />;
}
