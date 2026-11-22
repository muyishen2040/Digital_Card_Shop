import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { batchOneCities } from "./batch-01";

// Checksums of approved-direction assets in city-postcards-batch-01.zip.
// Missing artwork intentionally blocks merging the registration-only draft.
const artwork = [
  [
    "kyoto",
    "front",
    "2ae6cab91583dfe36b23335bdc3989038973787f8976bcc469b1933696e7c8c1"
  ],
  [
    "kyoto",
    "back",
    "a84c7f65fda7b5ec9f5aad1746bbaa2329670942ba7771b036779796011c73ea"
  ],
  [
    "seoul",
    "front",
    "47b2b99e7d42cab8f95f6a95f28defdaaade418f6cd286d05438f1a33171964d"
  ],
  [
    "seoul",
    "back",
    "f47cb06baaa5180a51ebcf8fe749ac332e64a3058885ed3b7a65f15d974f093a"
  ],
  [
    "paris",
    "front",
    "064f3885064403357f230537f0d987c2baddc3a66b7858da361b81799551291e"
  ],
  [
    "paris",
    "back",
    "46d3a5f5795bfc37877a295f337f3f2b5a76580b1983b915740fda97c89cdac8"
  ],
  [
    "san-francisco",
    "front",
    "de4346aad9bbd072c8e675346a77c7e93f8fad3c0bbfe21db95d64fd0534ac8d"
  ],
  [
    "san-francisco",
    "back",
    "9b2361ac756ddb6a5b4dbcdc55413200f24f386649a17c21751bb56a306f6724"
  ],
  [
    "singapore",
    "front",
    "d378e99d55b09692f8f5f9c92f10a6d59abaab41a0076acc340810849a5cf08a"
  ],
  [
    "singapore",
    "back",
    "859486df2932c5036022a5d6ad46c633f98c30e8714f7b4f9b0f5b7bf0efdf"
  ]
] as const;

describe("five-city postcard artwork upload", () => {
  it("has exactly two registered image assets for each destination", () => {
    expect(artwork.length).toBe(batchOneCities.length * 2);
    expect(artwork.map(([city,side]) => city + "/" + side).sort()).toEqual(
      batchOneCities.flatMap((city) => [city.assetKey + "/front", city.assetKey + "/back"]).sort(),
    );
  });

  it.each(artwork)("verifies the committed WebP at %s/%s", (city, side, sha256) => {
    const path = resolve(process.cwd(), "public", "cards", "city-postcards", city, side + ".webp");
    expect(existsSync(path), "Artwork is missing: " + path).toBe(true);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(sha256);
  });
});
