import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";

import { useSession } from "@/provider/session-provider";
import { reservationService } from "@/services/reservation-service";
import { reviewService } from "@/services/review-service";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { cn, dateFormat, rupiahFormat, timeFormat } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { useEffect } from "react";

export default function ReviewDetailPage() {
  const { reservationId } = useParams();
  const { user } = useSession();

  const {
    data: reservation,
    isLoading: isReservationLoading,
    isError: isReservationError,
    error: reservationError,
  } = useQuery({
    queryFn: () => reservationService.getReservation(reservationId),
    queryKey: ["reservation", reservationId],
  });
  const {
    data: review,
    isLoading: isReviewLoading,
    isError: isReviewError,
    error: reviewError,
  } = useQuery({
    queryFn: () => reviewService.getReview(reservationId),
    queryKey: ["reviews", reservationId],
    enabled: !!reservation?.data?.id,
  });

  if (isReservationLoading || isReviewLoading) {
    return <Loading />;
  }

  if (isReservationError || isReviewError) {
    const errorMessage =
      reservationError?.message || reviewError?.message || "An error occurred";

    return (
      <main className="mx-auto flex flex-col items-center justify-center">
        <div className="w-full max-w-[1440px] px-20 py-10">
          <Alert variant="destructive" className="border-2">
            <AlertTitle className="m-0">{errorMessage}</AlertTitle>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-screen-md space-y-6 px-4 py-4 lg:py-10">
        <Link
          to="/history"
          className={cn(buttonVariants(), "max-w-max font-bold")}
        >
          Kembali
        </Link>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-bold lg:text-2xl">
              {dateFormat(reservation.data.date)} |{" "}
              {timeFormat(reservation.data.timeSlot.time)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2">
              <div className="space-y-2">
                <h2 className="font-semibold lg:text-lg">
                  {reservation.data.category.name}
                </h2>
                <div className="flex flex-row items-center gap-2">
                  <p className="font-semibold">{user.name}</p>
                </div>
              </div>
              <div className="flex w-full flex-row justify-end">
                {reservation.data.category.images[0]?.imageUrl && 
                  <img
                    src={reservation.data.category.images[0].imageUrl}
                    alt="Category"
                    className="w-48"
                  />
                }
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-semibold lg:text-2xl">Detail Reservasi</h2>
              <Separator />
              <div className="inline-flex items-center justify-between">
                <p>{reservation.data.categoryPackage.name}</p>
                <p>{rupiahFormat(reservation.data.categoryPackage.price)}</p>
              </div>
              {reservation.data.reservation_detail?.map((detail) => (
                <div
                  key={detail.id}
                  className="inline-flex items-center justify-between"
                >
                  <p>
                    {detail.categoryAddon.name} x{detail.quantity}
                  </p>
                  <p>
                    {rupiahFormat(detail.categoryAddon.price * detail.quantity)}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="inline-flex items-center justify-between">
                <p>Total</p>
                <p>{rupiahFormat(reservation.data.total)}</p>
              </div>
            </div>

            {review && (
              <CardFooter className="p-0">
                {review.data.rating && (
                  <div className="flex flex-col gap-4">
                    <h2 className="font-semibold lg:text-2xl">Penilaian</h2>
                    <div className="flex flex-row gap-2 lg:gap-4">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`lg:size-4 ${
                            index < review.data.rating
                              ? "fill-current text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-semibold lg:text-lg">Review</h2>
                      <p className="overflow-wrap-anywhere hyphens-auto break-all text-gray-600">
                        {review.data.review}
                      </p>
                    </div>
                  </div>
                )}
              </CardFooter>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
