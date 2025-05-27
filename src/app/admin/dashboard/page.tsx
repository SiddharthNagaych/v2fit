import AdminPanel from "@/components/admin/AdminPanel";
import { auth } from "../../../../auth";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return <div className="text-[#C15364] p-6">Not authorized</div>;
  }

  return <AdminPanel />;
}
