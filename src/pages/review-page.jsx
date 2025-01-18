import CreateReviewForm from "@/components/form/review/create-review-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function ReviewPage() {
  return (
    <main className="mx-auto flex flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-xl space-y-6 px-4 py-4 lg:py-10">
        {/* <Link
          to="/history"
          className={cn(buttonVariants(), "max-w-max font-bold")}
        >
          Kembali
        </Link> */}
        <CreateReviewForm />
      </div>
    </main>
  );
}
