import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { hongKongPostcardDesign } from "./hong-kong";

describe("Hong Kong postcard artwork", () => {
  it.each([
    [hongKongPostcardDesign.frontImage, "6110863e7d6fb22d8c478841725a438c94c39c04529697a2359aef2e6d8f28c1"],
    [hongKongPostcardDesign.backImage, "9ac0b9113e473fc45e647b88fca64bb844692fbbc3b99070e1b5bcd24b04f2aa"],
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
