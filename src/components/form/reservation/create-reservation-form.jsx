/* eslint-disable no-unused-vars */
import * as React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfToday} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { id } from "date-fns/locale";

import { cn, rupiahFormat, timeFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/icons";

import { addonsService } from "@/services/addons-service";
import { packageService } from "@/services/package-service";
import { reservationService } from "@/services/reservation-service";
import { timeService } from "@/services/time-service";
import { CreateReservationSchema } from "@/schema/reservation-schema";
import { toast } from "sonner";
import { transactionService } from "@/services/transaction-service";
import { ButtonRadio, ButtonRadioItem } from "@/components/ui/button-radio";


export default function CreateReservationForm({ categoryPackageId }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(CreateReservationSchema),
    defaultValues: {
      date: "",
      timeId: "",
      categoryId: "",
      categoryPackageId: "",
      addons: [],
    },
  });

  const {
    data: pack,
    isLoading: packLoading,
    error: packError,
  } = useQuery({
    queryKey: ["packages", categoryPackageId],
    queryFn: () => packageService.getPackage(categoryPackageId),
  });

  const {
    data: addons,
    isLoading: addonsLoading,
    error: addonsError,
  } = useQuery({
    queryKey: ["addons", pack?.data?.category?.id],
    queryFn: () => addonsService.getAddonByCategory(pack?.data?.category?.id),
    enabled: !!pack?.data?.category?.id,
  });

  const {
    data: times,
    isLoading: timesLoading,
    error: timesError,
  } = useQuery({
    queryKey: ["timeslots"],
    queryFn: () => timeService.getTimes(),
  });

  const {
    data: reservation,
    isLoading: reservationLoading,
    error: reservationError,
  } = useQuery({
    queryKey: ["reservations", selectedDate],
    queryFn: () => reservationService.getReservationByDate(selectedDate),
    enabled: !!selectedDate,
  });

  React.useEffect(() => {
    if (pack) {
      form.reset({
        categoryId: pack.data.category.id,
        categoryPackageId: pack.data.id,
      });
    }
  }, [form, pack]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const calculateTotalPrice = () => {
    if (!pack || !addons) return 0;
    const basePrice = pack.data.price;
    const addonsPrices =
      form.watch("addons")?.reduce((total, addon) => {
        if (addon.id !== undefined && addon.quantity !== undefined) {
          const addonData = addons.data.find((a) => a.id === addon.id);
          return total + (addonData ? addonData.price * addon.quantity : 0);
        }
        return total;
      }, 0) || 0;
    return basePrice + addonsPrices;
  };

  const isTimeSlotDisabled = (timeSlot) => {
    const [hours, minutes] = `${timeSlot.time}`.split('T')[1].split(':')

    if(!selectedDate) {
      return true
    }

    const slotTime = new Date(currentDate);

    if(slotTime < new Date(selectedDate)) {
      return false
    }

    slotTime.setHours(hours, minutes, 0, 0);

    if (slotTime < currentDate) {
      return true;
    }

    if (reservation && reservation.data) {
      return reservation.data.some((r) => r.timeSlot.id === timeSlot.id);
    }

    return false;
  };

  const handleDateChange = (date) => {
    if (date) {
      const adjustedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      );
      const formattedDate =
        adjustedDate.toISOString().split("T")[0] + "T00:00:00.000Z";
      form.setValue("date", formattedDate);
      setSelectedDate(formattedDate);
    } else {
      form.setValue("date", "");
      setSelectedDate(null);
    }
    form.setValue("timeId", "");
  };

  const createReservationMutation = useMutation({
    mutationFn: async (data) => {
      return await reservationService.createReservation(data);
    },
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries("reservations");
      toast(data.message);
      setSelectedDate(null);
    },
    onError: (error) => {
      setErrorMsg(error.message);
      setIsSubmit(false);
      console.error("Create reservation error:", error);
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data) => {
      return await transactionService.create(data);
    },
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries("transactions");
      navigate(`/payment/${data.data.id}`);
    },
    onError: (error) => {
      setErrorMsg(error.message);
      setIsSubmit(false);
      console.error("Create transaction error:", error);
    },
  });

  const onSubmit = async (data) => {
    const filteredAddons =
      data.addons?.filter(
        (addon) => addon.id !== undefined && addon.quantity !== undefined,
      ) || [];

    const submissionData = {
      ...data,
      addons: filteredAddons,
    };

    console.log(submissionData)

    setErrorMsg("");
    setIsSubmit(true);
    try {
      const reservation =
        await createReservationMutation.mutateAsync(submissionData);

      const transactionData = {
        reservationId: reservation.data.id,
        type: data.type,
      };
      await createTransactionMutation.mutateAsync(transactionData);
    } catch (error) {
      console.error("Create reservation error:", error);
    } finally {
      setIsSubmit(false);
    }
  };

  const disabledDates = {
    before: startOfToday(),
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col gap-8 px-4 lg:px-20">
      {errorMsg && (
        <Alert variant="destructive">
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
      {packLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : packError ? (
        <Alert variant="destructive">
          <AlertDescription>{packError?.message}</AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-8">
            <div className="flex w-full flex-col gap-6">
              {packLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              ) : packError ? (
                <Alert variant="destructive">
                  <AlertDescription>{packError?.message}</AlertDescription>
                </Alert>
              ) : (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Reservasi</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(new Date(field.value), "eeee, dd MMMM yyyy", { locale: id })
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={handleDateChange}
                              disabled={disabledDates}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {timesLoading ? (
                    <div className="flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : timesError ? (
                    <Alert variant="destructive">
                      <AlertDescription>{timesError?.message}</AlertDescription>
                    </Alert>
                  ) : (
                    <FormField
                      control={form.control}
                      name="timeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waktu</FormLabel>
                          <ButtonRadio
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-5 gap-2 lg:grid-cols-8"
                          >
                            {times.data.map((time) => {
                              const isDisabled = isTimeSlotDisabled(time);
                              return (
                                <div
                                  className="flex items-center space-x-2"
                                  key={time.id}
                                >
                                  <ButtonRadioItem
                                    value={time.id.toString()}
                                    id={`time-${time.id}`}
                                    disabled={isDisabled}
                                    className={cn(
                                      "w-full",
                                      isDisabled &&
                                        "cursor-not-allowed !border-gray-400/60 !bg-gray-300/50 !text-black/50 !opacity-100",
                                    )}
                                  >
                                    <Label htmlFor={`time-${time.id}`}>
                                      {timeFormat(time.time)}
                                    </Label>
                                  </ButtonRadioItem>
                                </div>
                              );
                            })}
                          </ButtonRadio>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {addonsLoading ? (
                    <div className="flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : addonsError ? (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {addonsError?.message}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {addons.data.map((addon, index) => (
                        <div className="flex flex-col gap-2" key={addon.id}>
                          <FormField
                            control={form.control}
                            name={`addons.${index}.id`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value !== undefined}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange(addon.id);
                                        form.setValue(
                                          `addons.${index}.quantity`,
                                          1,
                                        );
                                      } else {
                                        field.onChange(undefined);
                                        form.setValue(
                                          `addons.${index}.quantity`,
                                          undefined,
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {addon.name} {rupiahFormat(addon.price)}{" "}
                                  {addon.unit}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          {form.watch(`addons.${index}.id`) !== undefined && (
                            <FormField
                              control={form.control}
                              name={`addons.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Jumlah tambahan"
                                      className="w-full"
                                      value={field.value}
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /\D/g,
                                          "",
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              )}
            </div>
            <div className="w-full">
              {packLoading || addonsLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              ) : packError || addonsError ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    {packError?.message || addonsError?.message}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="flex items-center justify-end">
                  <div className="flex flex-col gap-4 max-w-md w-full">
                    <Card>
                      <CardHeader>
                        <CardTitle>{pack.data.category.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex w-full flex-row justify-between">
                          <p>{pack.data.name}</p>
                          <p>{rupiahFormat(pack.data.price)}</p>
                        </div>
                        {form.watch("addons")?.map((addon, index) => {
                          if (
                            addon.id !== undefined &&
                            addon.quantity !== undefined
                          ) {
                            const addonData = addons.data.find(
                              (a) => a.id === addon.id,
                            );
                            return (
                              <div
                                key={index}
                                className="mt-2 flex w-full flex-row justify-between"
                              >
                                <p>
                                  {addonData.name} x{addon.quantity}
                                </p>
                                <p>
                                  {rupiahFormat(addonData.price * addon.quantity)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </CardContent>
                      <CardFooter className="flex flex-col items-end gap-6 border-t pt-6">
                        <div className="flex w-full flex-row justify-between font-semibold">
                          <p>Total</p>
                          <p>{rupiahFormat(calculateTotalPrice())}</p>
                        </div>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Metode Pelunasan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="type"
                          
                          render={({ field }) => (
                            <FormItem >
                              <ButtonRadio
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex items-center gap-5"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0 w-1/2">
                                  <FormControl>
                                    <ButtonRadioItem
                                      value="fullpayment"
                                      className="w-full font-normal"
                                    >
                                      Lunas
                                    </ButtonRadioItem>
                                  </FormControl>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 w-1/2">
                                  <FormControl>
                                    <ButtonRadioItem
                                      value="downpayment"
                                      className="w-full font-normal"
                                    >
                                      DP 50%
                                    </ButtonRadioItem>
                                  </FormControl>
                                </FormItem>
                              </ButtonRadio>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <hr className="my-2 opacity-0" />
                        <Button
                          className="w-full font-normal"
                          type="submit"
                          onClick={form.handleSubmit(onSubmit)}
                          isLoading={isSubmit}
                        >
                          Reservasi
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}

CreateReservationForm.propTypes = {
  categoryPackageId: PropTypes.string.isRequired,
};