import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { categoryService } from "@/services/category-service";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import CategoryPackageCarousel from "@/components/category/category-package-carousel";
import CategoryImagesDisplay from "@/components/category/category-images-display";

export default function CategoryDetailPage() {
  const { id } = useParams();

  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryService.getCategory(id),
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="mx-auto flex flex-col items-center justify-center gap-10">
      <div className="h-16 w-full bg-secondary lg:h-24">
        <div className="mx-auto flex h-full w-full max-w-[1440px] flex-row px-4 lg:px-20">
          <div className="my-auto inline-flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-500 transition-colors duration-200 hover:text-primary"
            >
              Beranda
            </Link>
            <ChevronRight />
            <Link
              to="/category"
              className="text-gray-500 transition-colors duration-200 hover:text-primary"
            >
              Kategori
            </Link>
            <ChevronRight />
            <Separator
              orientation="vertical"
              className="h-10 w-0.5 bg-muted-foreground"
            />
            <p className="min-w-8 max-w-16 truncate md:max-w-full">
              {category.data.name}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col gap-2 px-4 lg:gap-8 lg:px-20">
        <div className="text-xl lg:text-4xl">{category.data.name}</div>
      </div>
      <CategoryImagesDisplay categoryImages={category.data.images} />
      <CategoryPackageCarousel
        categoryPackages={category.data.category_packages}
      />
    </main>
  );
}
