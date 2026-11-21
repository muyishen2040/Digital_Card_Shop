import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { hongKongPostcardDesign } from "./hong-kong";

describe("Hong Kong postcard artwork", () => {
  it.each([hongKongPostcardDesign.frontImage, hongKongPostcardDesign.backImage])(
    "requires a committed WebP at %s before publication",
    (url) => {
      const path = resolve(process.cwd(), "public", url.slice(1));
      expect(existsSync(path), "Required artwork is missing: " + url).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
      expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
    },
  );
});
