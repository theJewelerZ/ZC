import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found" id="main-content">
      <div className="site-container not-found-inner">
        <p className="eyebrow">404 · Detail not found</p>
        <h1>This path is outside the plan.</h1>
        <p>
          The page may have moved, or the address may be incomplete. Return to
          the Zarka Construction homepage or start a project conversation.
        </p>
        <div className="not-found-actions">
          <Link className="button button-primary" href="/">
            Return home
          </Link>
          <Link className="button button-outline" href="/contact?service=simulator-construction">
            Request a Consultation
          </Link>
        </div>
      </div>
    </main>
  );
}

