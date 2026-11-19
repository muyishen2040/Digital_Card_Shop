import { redirect } from "next/navigation";

// Previous mock sender-studio URL now points to the recipient-first card demo.
export default function OldSunshineStudioRoute() {
  redirect("/cards/little-sunshine");
}
