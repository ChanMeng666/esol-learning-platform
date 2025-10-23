/**
 * Redirect from old /conversation route to new /practice/nzcel/conversation
 * Maintains backward compatibility
 */
import { redirect } from "next/navigation";

export default function ConversationRedirect() {
  redirect("/practice/nzcel/conversation");
}
