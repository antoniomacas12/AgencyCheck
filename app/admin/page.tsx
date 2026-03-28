import { redirect } from "next/navigation";

// /admin root → always redirect to the leads dashboard
export default function AdminRoot() {
  redirect("/admin/leads");
}
