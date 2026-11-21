"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { cardBrowseLabel, getCollectionGroups } from "@/lib/cards/catalog";
import type { CollectionFilter as Filter } from "@/lib/cards/catalog";
import { CollectionFilter } from "@/components/cards/CollectionFilter";
import styles from "./page.module.css";

export default function ExperienceLibrary() {
  const [filter, setFilter] = useState<Filter>("all");
  const groups = getCollectionGroups(filter);
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.wordmark}>little <em>moments</em></span>
          <nav className={styles.headerLinks} aria-label="Collection navigation">
            <span className={styles.headerMeta}>Interactive cards</span>
            <Link href="/create" className={styles.createLink}>Create a card</Link>
          </nav>
        </header>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>THE COLLECTION</span>
          <h1>Choose a little moment.</h1>
          <p>Find a beautiful way to say what matters.</p>
        </div>
        <div className={styles.filterBar}>
          <CollectionFilter value={filter} onChange={setFilter} />
        </div>
        <div className={styles.collections}>
          {groups.map(({ collection, cards }) => (
            <section key={collection.id} className={styles.collection} aria-labelledby={collection.id + "-heading"}>
              <div className={styles.collectionHeading}>
                <h2 id={collection.id + "-heading"}>{collection.title}</h2>
                <p>{collection.description}</p>
              </div>
              <div className={styles.grid}>
                {cards.map((card) => (
            <Link
              key={card.slug}
              href={`/cards/${card.slug}`}
              className={styles.tile}
              aria-label={`${card.title} — open interactive card`}
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
                {card.theme === "city-postcard" && (
                  <Image
                    className={styles.postcardThumbnail}
                    src={card.postcard.frontImage}
                    alt=""
                    fill
                    sizes="(max-width: 560px) 90vw, (max-width: 830px) 45vw, 350px"
                    unoptimized
                  />
                )}

              </div>
              <div className={styles.tileMeta}>
                <div>
                  <h3>{card.title}</h3>
                  <span>{cardBrowseLabel(card)}</span>
                </div>
                <span className={styles.action} aria-hidden="true">
                  {"↗"}
                </span>
              </div>
            </Link>
          ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
