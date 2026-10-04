import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ClosingCTA } from "../components/ClosingCTA";
import { PageHeader } from "../components/Primitives";
import { SEO } from "../components/SEO";
import { insightCategories, insights } from "../data/insights";

const upcoming = [
  { title: "Observability for AI agents", note: "What to log before anything ships." },
  { title: "Postgres schemas that survive pivots", note: "Modeling for the second version of a product." },
  { title: "Offline-first mobile sync", note: "Queues, conflicts, and honest UX." },
  { title: "Event contracts people can trust", note: "Naming, versioning, and owning topics." },
];

export function Insights() {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const article of insights) map.set(article.category, (map.get(article.category) ?? 0) + 1);
    return map;
  }, []);
  const filters = useMemo(() => ["All", ...insightCategories.filter((category) => (counts.get(category) ?? 0) > 0)], [counts]);
  const [filter, setFilter] = useState<string>("All");
  const filtered = filter === "All" ? [...insights] : insights.filter((article) => article.category === filter);
  const [featured, ...rest] = filtered;

  return <>
    <SEO title="Insights" description="Detailed notes on software engineering, AI systems, architecture, product delivery, and production operations." />
    <PageHeader eyebrow="Insights / Engineering library" title="Field notes for systems that keep running." description="Practical articles from Runtime Systems on product engineering, AI workflows, architecture, mobile behavior, and the decisions that make software dependable after launch." />

    <section className="insights-page container">
      <div className="insight-filters" role="group" aria-label="Filter insights by topic">
        {filters.map((category) => (
          <button key={category} type="button" aria-pressed={filter === category} className={filter === category ? "is-active" : ""} onClick={() => setFilter(category)}>
            {category}<sup>{category === "All" ? insights.length : counts.get(category)}</sup>
          </button>
        ))}
      </div>

      {featured && (
        <article className="insight-featured insight-featured--editorial" key={featured.slug} data-reveal>
          <figure className="insight-featured__media">
            <img src={featured.image} alt={featured.imageAlt} loading="eager" />
            <figcaption>{featured.category} / Featured article</figcaption>
          </figure>
          <div className="insight-featured__body">
            <p className="meta">{featured.category} / {featured.readTime} / {featured.date}</p>
            <h2>{featured.title}</h2>
            <p>{featured.summary}</p>
            <ul className="insight-takeaways" aria-label="Key takeaways">
              {featured.takeaways.map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}
            </ul>
          </div>
          <div className="article-body article-body--featured">
            {featured.sections.map((section) => (
              <section key={section.heading}>
                <h3>{section.heading}</h3>
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
          </div>
        </article>
      )}

      <div className="article-grid article-grid--full">
        {rest.map((article, index) => (
          <article key={article.slug} data-reveal data-reveal-delay={index * 80}>
            <figure className="article-media">
              <img src={article.image} alt={article.imageAlt} loading="lazy" />
              <figcaption>NOTE / 0{index + 2}</figcaption>
            </figure>
            <div className="article-card-copy">
              <p className="meta">{article.category} / {article.readTime} / {article.date}</p>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
              <ul className="insight-takeaways" aria-label="Key takeaways">
                {article.takeaways.map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}
              </ul>
            </div>
            <div className="article-body">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h3>{section.heading}</h3>
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="insight-queue" data-reveal>
        <p className="meta">CONTENT.QUEUE / NEXT SIGNALS</p>
        <ul>
          {upcoming.map((item, index) => (
            <li key={item.title}><span>0{index + 1}</span><b>{item.title}</b><em>{item.note}</em><i /></li>
          ))}
        </ul>
      </div>
    </section>
    <ClosingCTA title="Need thinking applied to your system?" />
  </>;
}
