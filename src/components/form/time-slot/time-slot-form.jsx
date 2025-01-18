import * as React from "react";
import { CreateTimeSlotSchema } from "@/schema/timeslot-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MinusIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { timeService } from "@/services/time-service";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TimeSlotForm() {
  const queryClient = useQueryClient();

  const [time, setTime] = React.useState("10:20");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const addMinutes = (time, minutes) => {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date(0, 0, 0, hours, mins);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toTimeString().slice(0, 5);
  };

  const isValidTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (
      totalMinutes >= 620 &&
      totalMinutes <= 1200 &&
      (totalMinutes - 600) % 20 === 0
    );
  };

  const handleIncrement = () => {
    const newTime = addMinutes(time, 20);
    if (isValidTime(newTime)) {
      setTime(newTime);
    }
  };

  const handleDecrement = () => {
    const newTime = addMinutes(time, -20);
    if (isValidTime(newTime)) {
      setTime(newTime);
    }
  };

  const form = useForm({
    resolver: zodResolver(CreateTimeSlotSchema),
    defaultValues: {
      time: time,
    },
  });

  React.useEffect(() => {
    form.setValue("time", time);
  }, [form, time]);

  const createTimeSlotMutation = useMutation({
    mutationFn: async (data) => timeService.createTime(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries("timeslots");
      toast(data.message);
    },
    onError: (error) => {
      setErrorMsg(error.message);
      console.error("Create time slot error:", error);
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg("");
    setIsSubmit(true);
    try {
      await createTimeSlotMutation.mutateAsync(data);
    } catch (error) {
      console.error("Create time slot error:", error);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 space-y-2">
        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="time">Masukkan waktu</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={time === "10:20" || isSubmit}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    type="time"
                    id="time"
                    step="1200"
                    min="10:00"
                    max="19:40"
                    className="flex-grow"
                    disabled={isSubmit}
                    {...field}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={time === "19:40" || isSubmit}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
