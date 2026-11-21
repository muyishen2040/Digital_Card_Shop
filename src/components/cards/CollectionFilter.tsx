"use client";

import { getCollectionFilters } from "@/lib/cards/catalog";
import type { CollectionFilter as Filter } from "@/lib/cards/catalog";
import styles from "./CollectionFilter.module.css";

export function CollectionFilter({
  value,
  onChange,
  disabled = false,
}: {
  value: Filter;
  onChange: (filter: Filter) => void;
  disabled?: boolean;
}) {
  return (
    <div className={styles.filters} role="group" aria-label="Filter by collection">
      {getCollectionFilters().map(({ id, label }) => (
        <button key={id} type="button" aria-pressed={id === value}
          disabled={disabled} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}
