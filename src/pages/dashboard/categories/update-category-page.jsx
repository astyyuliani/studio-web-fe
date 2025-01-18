import UpdateCategoryForm from "@/components/form/category/update-category-form";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function UpdateCategoryPage() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/dashboard/categories"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Kembali
      </Link>
      <UpdateCategoryForm categoryId={id} />
    </div>
  );
}
