import CreateCategoryForm from "@/components/form/category/create-category-form";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function CreateCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/dashboard/categories"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Kembali
      </Link>
      <CreateCategoryForm />
    </div>
  );
}
