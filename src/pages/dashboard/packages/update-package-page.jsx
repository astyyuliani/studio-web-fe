import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import UpdatePackageForm from "@/components/form/package/update-package-form";

export default function UpdatePackagePage() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/dashboard/packages"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Kembali
      </Link>
      <UpdatePackageForm packageId={id} />
    </div>
  );
}
