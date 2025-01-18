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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { categoryService } from "@/services/category-service";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Spinner } from "@/components/icons";
import { addonsService } from "@/services/addons-service";
import { CreateAddonSchema } from "@/schema/addon-schema";

export default function CreateAddonForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  const form = useForm({
    resolver: zodResolver(CreateAddonSchema),
    defaultValues: {
      name: "",
      unit: "",
      price: 0,
      category_id: "",
    },
  });

  const createAddonMutation = useMutation({
    mutationFn: async (data) => addonsService.createAddon(data),
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries("addons");
      toast(data.message);
      navigate("/dashboard/addons");
    },
    onError: (error) => {
      setErrorMsg(error.message);
      console.error("Create addon error:", error);
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg("");
    setIsSubmit(true);
    try {
      await createAddonMutation.mutateAsync(data);
    } catch (error) {
      console.error("Create addon error:", error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
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
                  {isLoading && <Spinner className="m-auto" />}
                  {isError && (
                    <SelectItem
                      disabled
                      className="text-destructive"
                      value="error"
                    >
                      Error: {error.message}
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
          Tambah Paket
        </Button>
      </form>
    </Form>
  );
}
