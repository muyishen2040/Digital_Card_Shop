import type { CardPersonalization } from "@/types/card";
import { SunshineCard } from "./sunshine/SunshineCard";
import { SkyCard } from "./sky/SkyCard";
import { WishCard } from "./wish/WishCard";

/** Reuse the exact recipient experience; private instances never get storefront chrome. */
export function renderRecipientCard(
  templateSlug: string,
  content: CardPersonalization,
): React.ReactElement | null {
  switch (templateSlug) {
    case "little-sunshine":
      return <SunshineCard content={content} />;
    case "same-sky":
      return <SkyCard content={content} />;
    case "make-a-wish":
      return <WishCard content={content} />;
    default:
      return null;
  }
}
