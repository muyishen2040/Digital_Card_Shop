import Link from "next/link";
import { cardTemplates } from "@/lib/cards/catalog";
import styles from "./page.module.css";

export default function ExperienceLibrary() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.wordmark}>little <em>moments</em></span>
          <span className={styles.headerMeta}>Interactive cards</span>
        </header>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>THE COLLECTION</span>
          <h1>Choose a little moment.</h1>
        </div>
        <div className={styles.grid}>
          {cardTemplates.map((card, index) => (
            <Link
              key={card.slug}
              href={`/cards/${card.slug}`}
              className={styles.tile}
              aria-label={`${card.title} — ${card.slug !== "make-a-wish" ? "open interactive card" : "view concept"}`}
            >
              <div className={`${styles.art} ${styles[card.theme]}`}>
                {card.theme === "sunshine" && (
                  <div className={styles.paperEnvelope} aria-hidden="true">
                    <span className={styles.paperSeal} />
                  </div>
                )}
                {card.theme === "night-sky" && (
                  <div className={styles.nightScene} aria-hidden="true">
                    <span className={styles.nightBook}>
                      <span className={styles.nightMoon} />
                      <span className={styles.nightSpark}>✦</span>
                    </span>
                  </div>
                )}
                {card.theme === "birthday" && (
                  <div className={styles.cakeScene} aria-hidden="true">
                    <span className={styles.candle} />
                  </div>
                )}
                <span className={styles.index}>0{index + 1}</span>
              </div>
              <div className={styles.tileMeta}>
                <div>
                  <h2>{card.title}</h2>
                  <span>{card.category}</span>
                </div>
                <span className={styles.action} aria-hidden="true">
                  {card.slug === "little-sunshine" ? "↗" : "→"}
                </span>
              </div>
              <p className={styles.status}>
                {card.slug !== "make-a-wish" ? "Interactive" : "Concept"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
