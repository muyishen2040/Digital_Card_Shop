import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CollectionFilter } from "./CollectionFilter";

describe("collection filter controls", () => {
  it("renders the available collections and a single pressed native button", () => {
    const html = renderToStaticMarkup(<CollectionFilter value="birthday" onChange={() => {}} />);
    expect(html).toContain('aria-label="Filter by collection"');
    expect(html).toContain("All cards");
    expect(html).toContain("City Postcards");
    expect(html).toContain("Birthday Cards");
    expect(html).toContain("General Cards");
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html.match(/type="button"/g)).toHaveLength(4);
  });

  it("disables every control while the sender is creating a card", () => {
    const html = renderToStaticMarkup(<CollectionFilter value="all" onChange={() => {}} disabled />);
    expect(html.match(/disabled=""/g)).toHaveLength(4);
  });
});
