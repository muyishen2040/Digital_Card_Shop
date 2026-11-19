import Link from "next/link";
import { cardTemplates } from "@/lib/cards/catalog";

const illustration: Record<string, string> = {
  sunshine: "✉",
  "night-sky": "✦",
  birthday: "✿",
};

export default function Home() {
  return (
    <main>
      <div className="site-shell">
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label="Digital Card Shop home">
            little <span>moments</span>
          </Link>
          <span className="header-note">A DIGITAL CARD EXPERIMENT</span>
        </header>

        <section className="hero">
          <div className="eyebrow"><span className="eyebrow-dot" /> Something thoughtful is growing</div>
          <h1>A little message.<br /><em>A lovely surprise.</em></h1>
          <p>
            We&apos;re exploring digital cards that feel like tiny experiences.
            Each design will open, unfold, or come alive—just for someone you care about.
          </p>
          <a className="hero-link" href="#gallery">Explore the directions <span aria-hidden="true">↘</span></a>
        </section>

        <section className="gallery" id="gallery" aria-labelledby="gallery-heading">
          <div className="section-heading">
            <div>
              <span className="section-kicker">EARLY CONCEPTS · PHASE ONE</span>
              <h2 id="gallery-heading">Three little worlds</h2>
            </div>
            <p>The concepts are ready to explore. Their interactive designs come next.</p>
          </div>
          <div className="card-grid">
            {cardTemplates.map((template, index) => (
              <Link className="concept" key={template.slug} href={"/cards/" + template.slug}>
                <div className={"concept-art concept-art--" + template.theme}>
                  <span className="concept-index">0{index + 1}</span>
                  <span className="concept-glyph" aria-hidden="true">{illustration[template.theme]}</span>
                  <span className="concept-status">Design in progress</span>
                </div>
                <div className="concept-info">
                  <span className="category">{template.category}</span>
                  <h3>{template.title}</h3>
                  <p>{template.description}</p>
                  <span className="concept-action">View the concept <span aria-hidden="true">↗</span></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <footer className="site-footer">Made for the moments that matter. <span>Prototype · No purchases or emails yet</span></footer>
      </div>
    </main>
  );
}
