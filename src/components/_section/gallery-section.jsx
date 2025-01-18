import PopularPhotos from "../gallery/popular-photos";
import InspirationPhotos from "../gallery/inspiration-photos";

export default function GallerySection() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center gap-8 px-4 md:gap-20 md:px-20">
      <h1 className="text-center text-2xl font-semibold md:text-4xl">
        Galeri Kami
      </h1>
      <PopularPhotos />
      <InspirationPhotos />
    </div>
  );
}
