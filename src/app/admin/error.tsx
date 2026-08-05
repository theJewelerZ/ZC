"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return <main className="admin-shell" id="main-content"><div className="form-error-summary" role="alert"><h1>Consultations could not be loaded.</h1><p>No private information has been displayed. Try the secure request again.</p><button className="button button-outline" onClick={reset} type="button">Try again</button></div></main>;
}
