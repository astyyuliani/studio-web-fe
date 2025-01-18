import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import CreatePackageForm from "@/components/form/package/create-package-form";

export default function CreatePackagePage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/dashboard/packages"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Kembali
      </Link>
      <CreatePackageForm />
    </div>
  );
}
