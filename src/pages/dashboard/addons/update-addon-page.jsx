import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import UpdateAddonForm from "@/components/form/addon/update-addon-form";

export default function UpdateAddonPage() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/dashboard/addons"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Kembali
      </Link>
      <UpdateAddonForm addonId={id} />
    </div>
  );
}
