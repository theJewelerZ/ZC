import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { businessConfig } from "@/config/business";
import { BuildCard } from "@/components/projects/build-card";
import { BuildShare } from "@/components/projects/build-share";
import { getPublishedBuild, getPublishedBuilds } from "@/lib/projects/repository";
import { label } from "@/lib/projects/schema";
import { getBuildShareData } from "@/lib/projects/share";

export const revalidate = 300;

function displayDate(value: string | null) {
  return value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { dateStyle: "long" }) : null;
}

function structuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedBuild(slug);
  if (!result) return {};
  const image = result.project.socialPhoto;
  const fallbackImage = new URL("/opengraph-image", businessConfig.canonicalUrl);
  const canonical = new URL(`/projects/${slug}`, businessConfig.canonicalUrl);
  return {
    title: result.project.title,
    description: result.project.summary,
    alternates: { canonical },
    openGraph: {
      title: result.project.title,
      description: result.project.summary,
      url: canonical,
      type: "article",
      publishedTime: result.project.publishedAt || undefined,
      modifiedTime: result.lastModified,
      images: image ? [{ url: image.url, alt: image.altText, width: image.width, height: image.height }] : [{ url: fallbackImage, alt: `${businessConfig.displayName} golf simulator room builder`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: result.project.title,
      description: result.project.summary,
      images: [image?.url || fallbackImage.toString()],
    },
  };
}

export default async function BuildDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [result, publishedBuilds] = await Promise.all([getPublishedBuild(slug), getPublishedBuilds()]);
  if (!result) notFound();
  const { project, milestones, unassignedPhotos, lastModified } = result;
  const related = publishedBuilds.filter((build) => build.id !== project.id).slice(0, 2);
  const latestMilestone = milestones.at(-1);
  const canonical = new URL(`/projects/${project.slug}`, businessConfig.canonicalUrl).toString();
  const shareData = getBuildShareData({
    slug: project.slug,
    title: project.title,
    description: project.summary,
  });
  const dates = project.status === "completed"
    ? [{ label: "Started", value: displayDate(project.actualStartedOn) }, { label: "Completed", value: displayDate(project.actualCompletedOn) }]
    : project.status === "current"
      ? [{ label: "Started", value: displayDate(project.actualStartedOn) }, { label: "Planned completion", value: displayDate(project.plannedCompletionOn) }]
      : [{ label: "Planned start", value: displayDate(project.plannedStartOn) }, { label: "Planned completion", value: displayDate(project.plannedCompletionOn) }];
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.summary,
    url: canonical,
    mainEntityOfPage: canonical,
    datePublished: project.publishedAt || undefined,
    dateModified: lastModified,
    image: project.socialPhoto?.url || undefined,
    author: { "@type": "Organization", name: businessConfig.displayName, url: businessConfig.canonicalUrl },
    publisher: { "@type": "Organization", name: businessConfig.displayName, url: businessConfig.canonicalUrl },
  };
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: businessConfig.canonicalUrl },
      { "@type": "ListItem", position: 2, name: "Inside the Build", item: new URL("/projects", businessConfig.canonicalUrl).toString() },
      { "@type": "ListItem", position: 3, name: project.title, item: canonical },
    ],
  };

  return <main id="main-content">
    <script dangerouslySetInnerHTML={{ __html: structuredData(articleData) }} type="application/ld+json" />
    <script dangerouslySetInnerHTML={{ __html: structuredData(breadcrumbData) }} type="application/ld+json" />
    <article className="build-journal">
      <header className="build-journal-hero">
        <div className={`site-container build-journal-hero-grid ${project.coverPhoto ? "has-cover" : ""}`}>
          <div className="build-journal-hero-copy">
            <Link className="build-back-link" href="/projects">Inside the Build</Link>
            <p className="eyebrow">{label(project.status)} Build</p>
            <h1>{project.title}</h1>
            {project.location ? <p className="build-location">{project.location}</p> : null}
            <p className="build-journal-summary">{project.summary}</p>
            <div className="build-journal-actions">
              {latestMilestone ? <a className="button button-primary" href={`#milestone-${latestMilestone.id}`}>Latest Progress</a> : null}
              <Link className="button button-outline-light" href={`/contact?service=simulator-construction&build=${encodeURIComponent(project.slug)}`}>Ask About a Build Like This</Link>
            </div>
            <BuildShare data={shareData} />
            <dl className="build-detail-meta"><div><dt>Build status</dt><dd>{label(project.status)}</dd></div>{dates.filter((date) => date.value).map((date) => <div key={date.label}><dt>{date.label}</dt><dd>{date.value}</dd></div>)}</dl>
          </div>
          {project.coverPhoto ? <figure className="build-cover"><Image alt={project.coverPhoto.altText} height={project.coverPhoto.height} priority sizes="(max-width: 900px) 100vw, 50vw" src={project.coverPhoto.url} width={project.coverPhoto.width} /><figcaption>{project.coverPhoto.caption}</figcaption></figure> : null}
        </div>
      </header>

      {project.startingPoint || project.zarkaRole ? <section className="build-story-foundation"><div className="site-container build-story-columns">{project.startingPoint ? <div><p className="eyebrow">The starting point</p><h2>What existed</h2><p>{project.startingPoint}</p></div> : null}{project.zarkaRole ? <div><p className="eyebrow">The work</p><h2>Zarka’s role</h2><p>{project.zarkaRole}</p></div> : null}</div></section> : null}

      {milestones.length ? <section className="build-milestones"><div className="site-container build-reading-column"><div className="build-journal-intro"><p className="eyebrow">The story of the room</p><h2>Milestones</h2><p>Each milestone records a meaningful change in the room and the thinking behind it.</p></div>{milestones.map((milestone, index) => <article className="build-milestone" id={`milestone-${milestone.id}`} key={milestone.id}><div className="build-milestone-marker"><span>{String(index + 1).padStart(2, "0")}</span><time dateTime={milestone.occurredOn}>{displayDate(milestone.occurredOn)}</time></div><div className="build-milestone-story"><h3>{milestone.title}</h3><p>{milestone.story}</p>{milestone.photos.length ? <div className={`build-milestone-photos ${milestone.photos.length === 1 ? "is-single" : ""}`}>{milestone.photos.map((photo, photoIndex) => <figure className={photoIndex === 0 ? "is-lead" : ""} key={photo.id}><Image alt={photo.altText} height={photo.height} sizes={photoIndex === 0 ? "(max-width: 900px) 100vw, 70vw" : "(max-width: 700px) 100vw, 35vw"} src={photo.url} width={photo.width} /><figcaption>{photo.caption}</figcaption></figure>)}</div> : null}</div></article>)}</div></section> : null}

      {unassignedPhotos.length ? <section className="build-project-details"><div className="site-container"><div className="build-journal-intro"><p className="eyebrow">Project details</p><h2>Additional views</h2></div><div className="build-detail-gallery">{unassignedPhotos.map((photo) => <figure key={photo.id}><Image alt={photo.altText} height={photo.height} sizes="(max-width: 700px) 100vw, 50vw" src={photo.url} width={photo.width} /><figcaption>{photo.caption}</figcaption></figure>)}</div></div></section> : null}

      {project.outcome || project.planningTakeaways ? <section className="build-completion-story"><div className="site-container build-story-columns">{project.outcome ? <div><p className="eyebrow">The completed environment</p><h2>What this room enables</h2><p>{project.outcome}</p></div> : null}{project.planningTakeaways ? <div><p className="eyebrow">For future rooms</p><h2>Planning takeaways</h2><p>{project.planningTakeaways}</p></div> : null}</div></section> : null}

      {related.length ? <section className="build-related"><div className="site-container"><div className="builds-heading"><div><p className="eyebrow">More Inside the Build</p><h2>Continue exploring the work.</h2></div><Link className="button button-outline" href="/projects">View all Builds</Link></div><div className="build-grid">{related.map((build) => <BuildCard build={build} key={build.id} />)}</div></div></section> : null}

      <section className="build-consultation-cta"><div className="site-container build-consultation-inner"><p className="eyebrow">Planning a similar room?</p><h2>Ask about a Build like this.</h2><p>Every room begins with understanding the space, how it will be used, and the conditions that will shape the golf experience.</p><Link className="button button-primary" href={`/contact?service=simulator-construction&build=${encodeURIComponent(project.slug)}`}>Request a Simulator Consultation</Link></div></section>
    </article>
  </main>;
}
