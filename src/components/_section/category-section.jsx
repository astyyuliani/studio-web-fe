import CategoryCarousel from "../category/category-carousel";

export default function CategorySection() {
  return (
    <div className="mx-auto flex w-full max-w-[1490px] flex-col items-center justify-center gap-8 lg:gap-20 lg:pl-16 lg:pr-24">
      <h1 className="text-center text-2xl font-semibold lg:text-4xl">
        Kategori Pilihan
      </h1>
      <CategoryCarousel />
    </div>
  );
}
