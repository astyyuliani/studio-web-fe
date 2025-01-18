import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import CreateAddonForm from "@/components/form/addon/create-addon-form";

export default function CreateAddonPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/dashboard/addons"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Kembali
      </Link>
      <CreateAddonForm />
    </div>
  );
}
