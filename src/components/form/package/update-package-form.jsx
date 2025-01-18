import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category-service";
import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Loading from "@/components/ui/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { UpdatePackageSchema } from "@/schema/package-schema";
import { packageService } from "@/services/package-service";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Spinner } from "@/components/icons";

export default function UpdatePackageForm({ packageId }) {
  const queryClient = useQueryClient();

  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isError, setIsError] = React.useState("");
  const navigate = useNavigate();

  const {
    data: packs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["packages", packageId],
    queryFn: () => packageService.getPackage(packageId),
  });

  const {
    data: categories,
    isLoading: categoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  const form = useForm({
    resolver: zodResolver(UpdatePackageSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
    },
  });

  React.useEffect(() => {
    if (packs) {
      form.reset({
        name: packs.data.name,
        description: packs.data.description,
        price: packs.data.price,
        categoryId: packs.data.category.id,
      });
    }
  }, [packs, form]);

  const updatePackageMutation = useMutation({
    mutationFn: async (data) => {
      return await packageService.updatePackage(packageId, data);
    },
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries("packages");

      toast(data.message);
      navigate("/dashboard/packages");
    },
    onError: (error) => {
      setIsError(error.message);
      setIsSubmit(false);
      console.error("Update package error:", error);
    },
  });

  const onSubmit = async (data) => {
    setIsError("");
    setIsSubmit(true);
    try {
      await updatePackageMutation.mutateAsync(data);
      setIsSubmit(false);
    } catch (error) {
      console.error("Update package error:", error.message);
    }
  };

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
              <FormLabel htmlFor="name">Nama Paket</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama paket" id="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan deskripsi paket"
                  id="description"
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Dapat dipisahkan dengan &quot;enter&quot;.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="price">Harga Paket</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan harga paket"
                  id="price"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                  {...field}
                />
              </FormControl>
              <FormDescription>Cukup ditulis angkanya saja.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryLoading && <Spinner className="m-auto" />}
                  {isCategoryError && (
                    <SelectItem
                      disabled
                      className="text-destructive"
                      value="error"
                    >
                      Error: {categoryError.message}
                    </SelectItem>
                  )}
                  {categories?.data?.length > 0 ? (
                    categories.data.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem
                      disabled
                      className="text-muted-foreground"
                      value="no-data"
                    >
                      Tidak ada data
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={isSubmit} type="submit" className="font-bold">
          Ubah Paket
        </Button>
      </form>
    </Form>
  );
}

UpdatePackageForm.propTypes = {
  packageId: PropTypes.string.isRequired,
};
