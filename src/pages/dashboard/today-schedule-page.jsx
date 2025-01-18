import TodayScheduleTable from "@/components/table/today-schedule-table";
import { dateFormat } from "@/lib/utils";

export default function TodaySchedulePage() {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0] + "T00:00:00.000Z";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium lg:text-3xl">
        Jadwal untuk {dateFormat(formattedDate)}
      </h1>
      <TodayScheduleTable />
    </div>
  );
}
