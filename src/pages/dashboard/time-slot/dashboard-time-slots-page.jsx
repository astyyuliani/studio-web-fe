import TimeSlotForm from "@/components/form/time-slot/time-slot-form";
import DeleteTimeSlot from "@/components/time-slot/delete-time-slot";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { timeFormat } from "@/lib/utils";
import { timeService } from "@/services/time-service";
import { useQuery } from "@tanstack/react-query";

export default function DashboardTimeSlotPage() {
  const {
    data: times,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["timeslots"],
    queryFn: () => timeService.getTimes(),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <TimeSlotForm />
      <div className="flex w-full flex-row flex-wrap gap-4 lg:w-1/2">
        {times.data.map((time) => (
          <div key={time.id} className="inline-flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="pointer-events-none w-16 border-2 font-bold hover:bg-transparent"
            >
              {timeFormat(time.time)}
            </Button>
            <DeleteTimeSlot timeId={time.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
