import CategoriesTable from "@/components/table/categories-table";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function DashboardCategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium lg:text-3xl">Kategori</h1>
      <Link
        to="/dashboard/categories/create"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Tambah Data
      </Link>
      <CategoriesTable />
    </div>
  );
}
