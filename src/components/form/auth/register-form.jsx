import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegisterSchema } from "@/schema/auth-schema";

export default function RegisterForm() {
  const queryClient = useQueryClient();

  const [isError, setIsError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const register = useMutation({
    mutationFn: (credentials) => authService.register(credentials),
    onSuccess: (data) => {
      toast(data.message);
      queryClient.invalidateQueries("user");
      setIsLoading(false);
      form.reset();
      navigate("/login");
    },
    onError: (error) => {
      setIsError(error.message);
      setIsLoading(false);
    },
  });

  const onSubmit = async (values) => {
    setIsError("");
    setIsLoading(true);
    try {
      await register.mutateAsync(values);
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl space-y-6 py-6 lg:px-12 lg:py-16">
      <CardHeader className="space-y-6 text-center">
        <CardTitle className="font-medium lg:text-4xl">Daftar</CardTitle>
        <CardDescription>
          Masuk untuk melakukan pemesanan di Infokus Studio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isError && <p className="text-red-500">{isError}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input placeholder="Nama Lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input placeholder="E-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input placeholder="No. Handphone / WhatsApp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Kata Sandi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex flex-col gap-8 p-0">
              <Button
                type="submit"
                className="w-full font-semibold"
                isLoading={isLoading}
              >
                Daftar
              </Button>
              <div className="inline-flex items-center space-x-2">
                <p className="text-border">Sudah punya akun?</p>
                <Link to="/login" className="text-primary">
                  Masuk
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
