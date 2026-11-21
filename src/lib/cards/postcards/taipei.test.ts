import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { taipeiPostcardDesign } from "./taipei";

describe("Taipei postcard artwork", () => {
  it.each([
    [taipeiPostcardDesign.frontImage, "fec7dda470f11a47112c9ec909664948123745b9a4836125bf4a99e08924291e"],
    [taipeiPostcardDesign.backImage, "2706d1e830fb56e3b63c7e9e2aacc7d404421c51c8c47bdf97fb9a389ffb8778"],
  ])(
    "requires a committed WebP at %s before publication",
    (url, sha256) => {
      const path = resolve(process.cwd(), "public", url.slice(1));
      expect(existsSync(path), "Required artwork is missing: " + url).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
      expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(sha256);
    },
  );
});
