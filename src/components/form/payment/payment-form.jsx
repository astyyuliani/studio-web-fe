/* eslint-disable no-unused-vars */
import { CreateCategorySchema } from "@/schema/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { imageService } from "@/services/image-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { transactionService } from "@/services/transaction-service";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const PaymentSchema = z.object({
  images: z.any(),
});

export default function PaymentForm() {
  const { transactionId } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isError, setIsError] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      images: "",
    },
  });

  const fileRefs = form.register("images");

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      return await imageService.upload(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("images");
      form.reset();
    },
    onError: (error) => {
      setIsError(error.message);
      setIsSubmit(false);
    },
  });

  const payMutation = useMutation({
    mutationFn: async (data) => {
      return await transactionService.pay(transactionId, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("transactions");
      toast(data.message);
      form.reset();
    },
    onError: (error) => {
      setIsError(error.message);
      setIsSubmit(false);
    },
  });

  const onSubmit = async (data) => {
    setIsError("");

    if (!data.images || data.images.length === 0) {
      setIsError("Gambar tidak boleh kosong");
      return;
    }

    const formData = new FormData();
    formData.append("images", data.images[0]);
    formData.append("entity", "transaction");

    setIsSubmit(true);

    try {
      const images = await uploadMutation.mutateAsync(formData);

      data.image = images.data[0].publicUrl;
      await payMutation.mutateAsync(data);
    } catch (error) {
      console.error("Create category error:", error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 pt-6"
      >
        {isError && (
          <Alert variant="destructive">
            <AlertDescription>{isError}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="file" {...fileRefs} accept="image/*" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-5">
          <Link
            to="/history"
            className={` flex items-center justify-center w-full  rounded-md border-2 border-primary text-primary hover:bg-primary/30 ease-out duration-100`}
          >
            Kembali
          </Link>
          <Button isLoading={isSubmit} type="submit" className="w-full font-bold">
            Kirim Bukti Pembayaran
          </Button>

        </div>
      </form>
    </Form>
  );
}
