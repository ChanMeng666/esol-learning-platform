/**
 * Redirect from old /practice route to new /practice/nzcel/skills
 * Maintains backward compatibility
 */
import { redirect } from "next/navigation";

export default function PracticeRedirect() {
  redirect("/practice/nzcel/skills");
}
