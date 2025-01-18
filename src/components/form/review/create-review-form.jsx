import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateReviewSchema } from "@/schema/review-schema";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review-service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreateReviewForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { reservationId } = useParams();
  const [rating, setRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateReviewSchema),
    defaultValues: {
      rating: 0,
      review: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data) => {
      return await reviewService.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("reviews");
      form.reset();
      toast(data.message);
      setIsProcessing(false);
      navigate(`/review/${reservationId}/detail`);
    },
    onError: (error) => {
      toast(error.message);
      console.error(error.message);
      setIsProcessing(false);
    },
  });

  const onSubmit = (data) => {
    data.reservationId = Number(reservationId);
    setIsProcessing(true);
    try {
      createReviewMutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-center">Berikan Penilaian</CardTitle>
            <CardDescription className="text-center">
              Silakan nilai pengalaman Anda di bawah ini
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-center">
                  <div className="inline-flex items-center gap-6">
                    <FormControl>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                              field.value >= star
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            onClick={() => {
                              field.onChange(star);
                              setRating(star);
                            }}
                            aria-label={`Rate ${star} stars out of 5`}
                          >
                            <Star className="h-8 w-8 fill-current" />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>{rating}/5</FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Berikan penilaian anda"
                      rows={7}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="grid grid-cols-2 gap-5 w-full">
              <Link
                to="/history"
                className={` flex items-center justify-center border-2 border-primary rounded-md text-primary hover:bg-primary/30 ease-out duration-100`}
              >
                Kembali
              </Link>
              <Button type="submit" className="w-full" isLoading={isProcessing}>
                Kirim
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
