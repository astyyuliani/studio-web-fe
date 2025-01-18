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
import { CreatePackageSchema } from "@/schema/package-schema";
import { packageService } from "@/services/package-service";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Spinner } from "@/components/icons";

export default function CreatePackageForm() {
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
    resolver: zodResolver(CreatePackageSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category_id: "",
    },
  });

  const createPackageMutation = useMutation({
    mutationFn: async (data) => packageService.createPackage(data),
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries("packages");
      toast(data.message);
      navigate("/dashboard/packages");
    },
    onError: (error) => {
      setErrorMsg(error.message);
      console.error("Create package error:", error);
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg("");
    setIsSubmit(true);
    try {
      await createPackageMutation.mutateAsync(data);
    } catch (error) {
      console.error("Create package error:", error);
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
