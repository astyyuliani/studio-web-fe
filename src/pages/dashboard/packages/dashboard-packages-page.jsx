import PackagesTable from "@/components/table/packages-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Link } from "react-router-dom";

export default function DashboardPackagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium lg:text-3xl">Paket</h1>
      <Link
        to="/dashboard/packages/create"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Tambah Data
      </Link>
      <PackagesTable />
    </div>
  );
}
