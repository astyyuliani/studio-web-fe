import { useQuery } from "@tanstack/react-query";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import CategoryCard from "./category-card";
import { categoryService } from "@/services/category-service";
import Loading from "../ui/loading";

export default function CategoryCarousel() {
  const options = {
    dragFree: true,
    containScroll: "trimSnaps",
  };

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => categoryService.getLatestCategories(),
    queryKey: ["categories"],
  });

  if (isLoading) {
    return <Loading />;
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
    <Carousel opts={options} className="mx-auto -ml-4 w-full lg:ml-0" showDots>
      <CarouselContent className="pb-8 lg:-ml-1 lg:mr-6">
        {categories.data.map((category) => (
          <CarouselItem key={category.id} className="basis-auto lg:pl-11">
            <CategoryCard category={category} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
