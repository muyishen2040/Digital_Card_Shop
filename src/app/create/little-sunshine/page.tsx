import { redirect } from "next/navigation";

// Preserve an existing prototype URL without exposing a sender-facing editor.
export default function SunshineCardLegacyRedirect() {
  redirect("/cards/little-sunshine");
}
