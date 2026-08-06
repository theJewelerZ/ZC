import Link from "next/link";

import { BuildCard } from "@/components/projects/build-card";
import { getPublishedBuilds } from "@/lib/projects/repository";

export async function InsideTheBuildSection() {
  const builds = await getPublishedBuilds({ featuredOnly: true });
  if (!builds.length) return null;
  return <section className="section builds-section" id="projects"><div className="site-container"><div className="builds-heading"><div><p className="eyebrow">Inside the Build</p><h2>See the story behind the room.</h2><p>Follow real simulator environments through the decisions, craftsmanship, and details that shape how they will play.</p></div><Link className="button button-outline" href="/projects">Explore Inside the Build</Link></div><div className="build-grid">{builds.slice(0, 3).map((build) => <BuildCard build={build} key={build.id} />)}</div></div></section>;
}
