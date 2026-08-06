import Link from "next/link";

export function AdminNav() {
  return (
    <nav aria-label="Founder operations" className="admin-nav">
      <Link href="/admin">Mission Control</Link>
      <Link href="/admin/consultations">Consultations</Link>
      <Link href="/admin/projects">Builds</Link>
      <Link href="/field">Field Mode</Link>
      <Link href="/" target="_blank">Public Site</Link>
      <form action="/auth/signout" method="post"><button type="submit">Sign Out</button></form>
    </nav>
  );
}
