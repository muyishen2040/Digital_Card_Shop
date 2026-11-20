import Link from "next/link";
import styles from "./not-found.module.css";

/** Invalid, unavailable, expired and revoked links receive identical copy. */
export default function UnavailableCard() {
  return (
    <main className={styles.page}>
      <section className={styles.note}>
        <span className={styles.ornament} aria-hidden="true">✦</span>
        <h1>This little moment is no longer available.</h1>
        <p>The card link may have expired or may no longer be valid.</p>
        <Link href="/" prefetch={false}>Explore the cards</Link>
      </section>
    </main>
  );
}
