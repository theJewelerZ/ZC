import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { businessConfig } from "@/config/business";
import { getPublishedBuild } from "@/lib/projects/repository";
import { label } from "@/lib/projects/schema";

export const revalidate = 300;

function displayDate(value: string | null) {
  return value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { dateStyle: "long" }) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedBuild(slug);
  if (!result) return {};
  const image = result.photos[0]?.url;
  return {
    title: result.project.public_title,
    description: result.project.public_summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: result.project.public_title,
      description: result.project.public_summary ?? undefined,
      url: new URL(`/projects/${slug}`, businessConfig.canonicalUrl),
      type: "article",
      images: image ? [{ url: image, alt: result.photos[0]?.alt_text ?? result.project.public_title }] : undefined,
    },
    twitter: { card: "summary_large_image", title: result.project.public_title, description: result.project.public_summary ?? undefined, images: image ? [image] : undefined },
  };
}

export default async function BuildDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublishedBuild(slug);
  if (!result) notFound();
  const { project, updates, photos } = result;
  const start = displayDate(project.started_on);
  const completion = displayDate(project.completed_on);
  return <main id="main-content">
    <header className="build-detail-hero"><div className="site-container"><p className="eyebrow">Inside the Build · {label(project.public_build_status)}</p><h1>{project.public_title}</h1>{project.public_location ? <p className="build-location">{project.public_location}</p> : null}<p>{project.public_summary}</p><dl className="build-detail-meta"><div><dt>Build status</dt><dd>{label(project.public_build_status)}</dd></div><div><dt>Current stage</dt><dd>{label(project.project_stage)}</dd></div>{start ? <div><dt>Started</dt><dd>{start}</dd></div> : null}{completion ? <div><dt>Completed</dt><dd>{completion}</dd></div> : null}</dl></div></header>
    {photos.length ? <section className="section"><div className="site-container"><div className="build-journal-intro"><p className="eyebrow">Approved project photography</p><h2>The room taking shape.</h2><p>Each image is selected from the real Build and published with the context needed to understand the work.</p></div><div className="build-gallery">{photos.map((photo) => <figure key={photo.id}><Image alt={photo.alt_text || ""} height={1200} sizes="(max-width: 800px) 100vw, 50vw" src={photo.url} width={1600}/><figcaption>{photo.caption}</figcaption></figure>)}</div></div></section> : null}
    {updates.length ? <section className="section build-updates"><div className="site-container"><div className="build-journal-intro"><p className="eyebrow">Progress story</p><h2>Updates from the Build</h2><p>Founder-approved notes document how the simulator environment moves from planning toward play.</p></div><div className="build-timeline">{updates.map((update) => <article key={update.id}><time dateTime={update.occurred_on}>{displayDate(update.occurred_on)}</time><h3>{update.title}</h3><p>{update.body}</p></article>)}</div></div></section> : null}
    {!photos.length && !updates.length ? <section className="section"><div className="site-container builds-empty"><h2>This Build story is getting started.</h2><p>Approved photography and progress updates will appear as the work moves forward.</p></div></section> : null}
    <section className="build-consultation-cta"><div className="site-container"><p className="eyebrow">Your room begins with a review</p><h2>Planning a simulator environment?</h2><p>Start with a practical conversation about the space, how it will be used, and the construction conditions that will shape the experience.</p><Link className="button button-primary" href="/contact?service=simulator-construction">Request a Simulator Consultation</Link></div></section>
  </main>;
}
