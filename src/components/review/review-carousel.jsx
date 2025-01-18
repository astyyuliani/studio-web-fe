import { useQuery } from "@tanstack/react-query";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import ReviewCard from "./review-card";
import { reviewService } from "@/services/review-service";
import Loading from "../ui/loading";

export default function ReviewCarousel() {
  const options = {
    dragFree: true,
    containScroll: "trimSnaps",
  };

  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => reviewService.getSomeReviews(),
    queryKey: ["reviews"],
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <Carousel opts={options} className="mx-auto w-full lg:ml-0">
      <CarouselContent className="-ml-3 pb-4 lg:-ml-4 lg:mr-2">
        {reviews.data.map((review, index) => (
          <CarouselItem
            key={index}
            className="max-w-lg basis-auto pl-3 lg:pl-5"
          >
            <ReviewCard
              userName={review.user.name}
              review={review.review}
              rating={review.rating}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
