import AddonsTable from "@/components/table/addons-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function DashboardAddonsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium lg:text-3xl">Tambahan</h1>
      <Link
        to="/dashboard/addons/create"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Tambah Data
      </Link>
      <AddonsTable />
    </div>
  );
}
