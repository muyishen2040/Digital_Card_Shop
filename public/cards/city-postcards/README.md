# City Postcards artwork

Each directory represents one independently maintained city, not an upload batch or release group.

```text
city-postcards/
├── README.md
└── <city-slug>/
    ├── front.webp
    ├── back.webp
    └── README.md    # optional destination-specific artwork/provenance notes
```

The two images are coordinated 3:4 portrait card faces. The front may contain fixed destination typography; the back must reserve a generous blank middle area because the recipient greeting, personal note and signature are rendered as **real HTML**, never baked into a background image.

The typed destination registry is `src/lib/cards/postcards/destinations.ts`. Image integrity is verified in `src/lib/cards/postcards/artwork-integrity.test.ts`; record both SHA-256 hashes there whenever an asset is added or intentionally replaced. File paths are stable product URLs, so review changes carefully.

Read [the City Postcards publishing guide](../../../docs/CITY_POSTCARDS.md) for the complete workflow, artwork quality and licensing requirements, database allowlisting, and release checks. Capture actual source-photo permissions and any AI-generated artwork limitations per city. A generated illustration is not evidence of a license for its underlying reference photograph.
