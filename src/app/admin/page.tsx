import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { MissionControl } from "@/components/admin/mission-control";
import { requireAdmin } from "@/lib/admin/auth";
import { getMissionControlData } from "@/lib/admin/mission-control";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Mission Control", robots: { index: false, follow: false, nocache: true } };

export default async function AdminDashboard() {
  await requireAdmin();
  const data = await getMissionControlData();
  return <main className="admin-shell mission-shell" id="main-content"><AdminNav/><MissionControl data={data}/></main>;
}
