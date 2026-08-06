import type { Metadata } from "next";

import { BuildCard } from "@/components/projects/build-card";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedBuilds, groupBuilds } from "@/lib/projects/repository";
import { label } from "@/lib/projects/schema";

export const revalidate = 300;
export const metadata: Metadata = createPageMetadata({
  title: "Inside the Build",
  description: "Follow the planning, craftsmanship, and progress behind real Zarka Construction golf simulator environments.",
  path: "/projects",
});

export default async function BuildsPage() {
  const groups = groupBuilds(await getPublishedBuilds()).filter((group) => group.builds.length);
  return <main id="main-content">
    <header className="builds-hero"><div className="site-container builds-hero-content"><p className="eyebrow">Inside the Build</p><h1>The story behind each room.</h1><p>Follow real simulator environments from their starting conditions through the decisions, craftsmanship, and details that shape how the room will play.</p>{groups.length ? <nav aria-label="Build collections" className="build-collection-nav">{groups.map((group) => <a href={`#${group.status}-builds`} key={group.status}>{group.status === "completed" ? "Completed Builds" : `${label(group.status)} Builds`}</a>)}</nav> : null}</div></header>
    <div className="site-container builds-page">
      {groups.map((group) => <section id={`${group.status}-builds`} key={group.status}><div className="builds-section-heading"><p className="eyebrow">{group.status === "completed" ? "Enduring project proof" : "Follow the work"}</p><h2>{group.status === "completed" ? "Completed Builds" : `${label(group.status)} Builds`}</h2></div><div className="build-grid">{group.builds.map((build) => <BuildCard build={build} key={build.id} />)}</div></section>)}
      {!groups.length ? <div className="builds-empty"><h2>Build stories will appear when the work is ready to share.</h2><p>Every published story begins with a real room, clear permission, and meaningful documentation.</p></div> : null}
    </div>
  </main>;
}
