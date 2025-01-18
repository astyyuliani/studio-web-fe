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
import Loading from "@/components/ui/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Spinner } from "@/components/icons";
import { UpdateAddonSchema } from "@/schema/addon-schema";
import { addonsService } from "@/services/addons-service";

export default function UpdateAddonForm({ addonId }) {
  const queryClient = useQueryClient();

  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isError, setIsError] = React.useState("");
  const navigate = useNavigate();

  const {
    data: addon,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["addons", addonId],
    queryFn: () => addonsService.getAddon(addonId),
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
    resolver: zodResolver(UpdateAddonSchema),
    defaultValues: {
      name: "",
      unit: "",
      price: 0,
      categoryId: "",
    },
  });

  React.useEffect(() => {
    if (addon) {
      form.reset({
        name: addon.data.name,
        unit: addon.data.unit,
        price: addon.data.price,
        categoryId: addon.data.category.id,
      });
    }
  }, [addon, form]);

  const updateAddonMutation = useMutation({
    mutationFn: async (data) => {
      return await addonsService.updateAddon(addonId, data);
    },
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries("addons");

      toast(data.message);
      navigate("/dashboard/addons");
    },
    onError: (error) => {
      setIsError(error.message);
      setIsSubmit(false);
      console.error("Update addon error:", error);
    },
  });

  const onSubmit = async (data) => {
    setIsError("");
    setIsSubmit(true);
    try {
      await updateAddonMutation.mutateAsync(data);
      setIsSubmit(false);
    } catch (error) {
      console.error("Update addon error:", error.message);
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
              <FormLabel htmlFor="name">Nama Tambahan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan nama tambahan"
                  id="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="unit">Satuan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan satuan tambahan"
                  id="unit"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Contoh: orang, menit (atau 5 menit), jam, background
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
              <FormLabel htmlFor="price">Harga Tambahan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan harga tambahan"
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

UpdateAddonForm.propTypes = {
  addonId: PropTypes.string.isRequired,
};
