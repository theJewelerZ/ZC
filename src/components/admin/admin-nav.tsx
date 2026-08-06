import Link from "next/link";
export function AdminNav() { return <nav aria-label="Founder dashboard" className="admin-nav"><Link href="/admin">Dashboard</Link><Link href="/admin/consultations">Consultations</Link><Link href="/admin/projects">Projects</Link><span aria-disabled="true">Site <small>Planned</small></span></nav>; }
