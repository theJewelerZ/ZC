"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return <main className="admin-shell" id="main-content"><div className="form-error-summary" role="alert"><h1>The secure admin request could not be completed.</h1><p>No private information has been displayed. Return to the dashboard or try the request again.</p><button className="button button-outline" onClick={reset} type="button">Try again</button></div></main>;
}