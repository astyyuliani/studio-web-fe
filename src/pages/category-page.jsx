import CategoryCard from "@/components/category/category-card";
import { Spinner } from "@/components/icons";
import { categoryService } from "@/services/category-service";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function CategoryPage() {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => categoryService.getCategories(),
    queryKey: ["categories"],
  });

  useEffect(() => {
    console.log(categories)
  })

  if (isLoading) {
    return <Spinner className="size-4" />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  if (!categories || categories.data.length === 0) {
    return (
      <div className="flex h-24 w-full items-center justify-center">
        <p>Belum ada data</p>
      </div>
    );
  }

  return (
    <main className="mx-auto flex flex-col items-center justify-center">
      <div className="h-16 w-full bg-secondary lg:h-24">
        <div className="mx-auto flex h-full w-full max-w-[1440px] flex-row items-center px-4 lg:px-20">
          <div className="inline-flex gap-4">
            <Link
              to="/"
              className="text-gray-500 transition-colors duration-200 hover:text-primary"
            >
              Beranda
            </Link>
            <ChevronRight />
            <p className="text-gray-500">Kategori</p>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] px-4 py-4 lg:px-20 lg:py-8">
        <div className="grid w-max gap-8 md:grid-cols-2 xl:grid-cols-3">
          {categories.data.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
}
