import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category-service";
import { imageService } from "@/services/image-service";
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
import Loading from "@/components/ui/loading";
import { MultipleImageInput } from "@/components/ui/multiple-image-input";
import { MultipleImage } from "@/components/ui/multiple-image";
import { UpdateCategorySchema } from "@/schema/category-schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function UpdateCategoryForm({ categoryId }) {
  const queryClient = useQueryClient();

  const [categoryImages, setCategoryImages] = React.useState([]);
  const [categoryNewImages, setCategoryNewImages] = React.useState([]);
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isError, setIsError] = React.useState("");
  const navigate = useNavigate();

  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => categoryService.getCategory(categoryId),
  });

  const form = useForm({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      name: "",
      deskripsi: "",
      images_url: [],
      images: [],
    },
  });

  React.useEffect(() => {
    if (category) {
      form.reset({
        name: category.data.name,
        deskripsi: category.data.deskripsi,
        images_url: category.data.images,
      });
      setCategoryImages(category.data.images);
    }
  }, [category, form]);

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

  const updateCategoryMutation = useMutation({
    mutationFn: async (data) => {
      return await categoryService.updateCategory(categoryId, data);
    },
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries("categories");
      setCategoryNewImages([]);
      toast(data.message);
      navigate("/dashboard/categories");
    },
    onError: (error) => {
      console.log('test')
      setIsError(error.message);
      setIsSubmit(false);
      console.error("Update category error:", error);
    },
  });

  const onSubmit = async (data) => {
    setIsError("");
    const newImages = data.images.length;
    const existringImages = categoryImages.length;

    if (
      (!data.images || data.images.length === 0) &&
      categoryImages.length === 0
    ) {
      setIsError("Gambar tidak boleh kosong");
      return;
    }

    if (newImages + existringImages > 3) {
      setIsError("Total gambar tidak boleh lebih dari 3");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < data.images.length; i++) {
      formData.append("images", data.images[i]);
    }
    formData.append("entity", "category");

    setIsSubmit(true);

    try {
      if (newImages > 0) {
        const newImages = await uploadMutation.mutateAsync(formData);
        data.images = [...categoryImages, ...newImages.data];
        const payload = {
          ...data,
          images: data.images.map(v => {
            if(typeof(v) === 'object') {
              return v['publicUrl']
            }else{
              return v
            }
          })
        }

        await updateCategoryMutation.mutateAsync(payload);
        setIsSubmit(false);
        return;
      }

      data.images = categoryImages;
      await updateCategoryMutation.mutateAsync(data);
      setIsSubmit(false);
    } catch (error) {
      console.error("Update category error:", error.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault()
    console.log('test')
  }

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

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
          name="images_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="images_url">Gambar Kategori</FormLabel>
              <FormControl>
                <MultipleImage
                  id="images_url"
                  placeholder="Existing Images"
                  {...field}
                  value={categoryImages}
                  onChange={(value) => {
                    setCategoryImages(value);
                    field.onChange(value);
                  }}
                />
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
              <FormLabel htmlFor="images">Gambar Baru Kategori</FormLabel>
              <FormControl>
                <MultipleImageInput
                  id="images"
                  placeholder="Add New Images"
                  {...fileRefs}
                  value={categoryNewImages}
                  onChange={(value) => {
                    setCategoryNewImages(value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          isLoading={isSubmit || isLoading}
          type="submit"
          className="font-bold"
        >
          Ubah Kategori
        </Button>
      </form>
    </Form>
  );
}

UpdateCategoryForm.propTypes = {
  categoryId: PropTypes.string.isRequired,
};
