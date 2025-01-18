import CategorySection from "@/components/_section/category-section";

import ReviewSection from "@/components/_section/review-section";
import HeroSection from "@/components/_section/hero-section";
import GallerySection from "@/components/_section/gallery-section";

export default function HomePage() {
  return (
    <main className="flex w-full flex-col items-center justify-center gap-10 lg:gap-20">
      <HeroSection />
      <CategorySection />
      <GallerySection />
      <ReviewSection />
    </main>
  );
}
