import prisma from "@/lib/prisma";
import { AdminSettingsClient } from "./AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.systemSetting.findMany();
  return <AdminSettingsClient initialSettings={settings} />;
}
