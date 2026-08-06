import Image from "next/image";
import Link from "next/link";

import type { PublicBuild } from "@/lib/projects/repository";
import { label } from "@/lib/projects/schema";

function shortDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function BuildCard({ build }: { build: PublicBuild }) {
  return <article className="build-card">
    <Link aria-label={`View the Build: ${build.title}`} className="build-card-media" href={`/projects/${build.slug}`}>
      {build.coverPhoto ? <Image
        alt={build.coverPhoto.altText}
        height={build.coverPhoto.height}
        sizes="(max-width: 800px) 100vw, 33vw"
        src={build.coverPhoto.url}
        width={build.coverPhoto.width}
      /> : <div aria-hidden="true" className="build-card-placeholder"><span>Inside the Build</span></div>}
    </Link>
    <div className="build-card-content">
      <div className="build-card-kicker"><span>{label(build.status)} Build</span>{build.location ? <span>{build.location}</span> : null}</div>
      <h3><Link href={`/projects/${build.slug}`}>{build.title}</Link></h3>
      <p>{build.summary}</p>
      {build.latestMilestone ? <p className="build-card-progress"><span>Latest progress</span><strong>{build.latestMilestone.title}</strong><time dateTime={build.latestMilestone.occurredOn}>{shortDate(build.latestMilestone.occurredOn)}</time></p> : null}
      <Link className="text-link" href={`/projects/${build.slug}`}>View the Build <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}
