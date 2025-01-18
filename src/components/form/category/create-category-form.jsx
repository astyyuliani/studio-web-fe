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
import { Button } from "@/components/ui/button";
import { MultipleImageInput } from "@/components/ui/multiple-image-input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { imageService } from "@/services/image-service";
import { categoryService } from "@/services/category-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreateCategoryForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [categoryImages, setCategoryImages] = React.useState([]);
  const [isError, setIsError] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
      deskripsi: "",
      images: [],
    },
  });

  const fileRefs = form.register("images");

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      return await imageService.upload(formData);
    },
    onError: (error) => {
      setIsError(error.message);
      setIsSubmit(false);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data) => {
      return await categoryService.createCategory(data);
    },
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries("categories");
      setCategoryImages([]);
      toast(data.message);
      navigate("/dashboard/categories");
    },
    onError: (error) => {
      setIsError(error.message);
      setIsSubmit(false);
      console.error("Create category error:", error);
    },
  });

  const onSubmit = async (data) => {
    setIsError("");

    if (!data.images || data.images.length === 0) {
      setIsError("Gambar yang diunggah minimal 1 gambar");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < data.images.length; i++) {
      formData.append("images", data.images[i]);
    }
    formData.append("entity", "category");

    setIsSubmit(true);

    try {
      const images = await uploadMutation.mutateAsync(formData);

      data.images = images.data;

      

      await createCategoryMutation.mutateAsync({
        ...data,
        images: data.images.map(v => v['publicUrl'])
      });
    } catch (error) {
      console.error("Create category error:", error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isError && (
          <Alert variant="destructive">
            <AlertDescription>{isError}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Nama Kategori</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" id="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="deskripsi">Deskripsi</FormLabel>
              <FormControl>
                <Input placeholder="Enter category description" id="deskripsi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="images">Gambar Kategori</FormLabel>
              <FormControl>
                <MultipleImageInput
                  id="images"
                  disabled={isSubmit}
                  {...fileRefs}
                  value={categoryImages}
                  onChange={(value) => {
                    const event = {
                      target: {
                        value: value,
                        type: "file",
                      },
                    };

                    setCategoryImages(value);
                    fileRefs.onChange(event);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={isSubmit} type="submit" className="font-bold">
          Tambah Kategori
        </Button>
      </form>
    </Form>
  );
}
