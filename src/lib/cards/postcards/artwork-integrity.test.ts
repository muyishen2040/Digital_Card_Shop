import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { cityPostcardManifests } from "./destinations";

/** SHA-256 of each reviewed image. A new destination must pin both assets. */
const approvedArtwork = {
  "city-postcard-hong-kong": {
    "front": "6110863e7d6fb22d8c478841725a438c94c39c04529697a2359aef2e6d8f28c1",
    "back": "9ac0b9113e473fc45e647b88fca64bb844692fbbc3b99070e1b5bcd24b04f2aa"
  },
  "city-postcard-taipei": {
    "front": "fec7dda470f11a47112c9ec909664948123745b9a4836125bf4a99e08924291e",
    "back": "2706d1e830fb56e3b63c7e9e2aacc7d404421c51c8c47bdf97fb9a389ffb8778"
  },
  "city-postcard-kyoto": {
    "front": "2ae6cab91583dfe36b23335bdc3989038973787f8976bcc469b1933696e7c8c1",
    "back": "a84c7f65fda7b5ec9f5aad1746bbaa2329670942ba7771b036779796011c73ea"
  },
  "city-postcard-seoul": {
    "front": "47b2b99e7d42cab8f95f6a95f28defdaaade418f6cd286d05438f1a33171964d",
    "back": "f47cb06baaa5180a51ebcf8fe749ac332e64a3058885ed3b7a65f15d974f093a"
  },
  "city-postcard-paris": {
    "front": "064f3885064403357f230537f0d987c2baddc3a66b7858da361b81799551291e",
    "back": "46d3a5f5795bfc37877a295f337f3f2b5a76580b1983b915740fda97c89cdac8"
  },
  "city-postcard-san-francisco": {
    "front": "de4346aad9bbd072c8e675346a77c7e93f8fad3c0bbfe21db95d64fd0534ac8d",
    "back": "9b2361ac756ddb6a5b4dbcdc55413200f24f386649a17c21751bb56a306f6724"
  },
  "city-postcard-singapore": {
    "front": "d378e99d55b09692f8f5f9c92f10a6d59abaab41a0076acc340810849a5cf08a",
    "back": "859486df2932c5036022a5d6ad46c633f98c30e8714f7b4f9b0f9f5b7bf0efdf"
  }
} as const;

describe("city postcard artwork integrity", () => {
  it("pins exactly the published destination assets", () => {
    expect(Object.keys(approvedArtwork).sort()).toEqual(
      cityPostcardManifests.map(({ slug }) => slug).sort(),
    );
  });

  const assets = Object.entries(approvedArtwork).flatMap(([slug, pair]) => [
    { slug, side: "front" as const, sha256: pair.front },
    { slug, side: "back" as const, sha256: pair.back },
  ]);

  it.each(assets)("verifies the approved WebP for $slug/$side", ({ slug, side, sha256 }) => {
    const manifest = cityPostcardManifests.find((city) => city.slug === slug);
    expect(manifest, "Missing postcard manifest for " + slug).toBeDefined();
    const url = side === "front" ? manifest!.postcard.frontImage : manifest!.postcard.backImage;
    const path = resolve(process.cwd(), "public", url.slice(1));
    expect(existsSync(path), "Required artwork is missing: " + url).toBe(true);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(sha256);
  });
});
