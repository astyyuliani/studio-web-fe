import ReviewCarousel from "../review/review-carousel";

export default function ReviewSection() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 lg:gap-20 lg:px-20">
      <h1 className="text-center text-2xl font-semibold md:text-4xl">
        Apa Yang Dikatakan Pelanggan Kami
      </h1>
      <ReviewCarousel />
    </div>
  );
}
