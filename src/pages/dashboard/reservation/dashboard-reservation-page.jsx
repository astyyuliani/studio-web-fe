import ReservationsTable from "@/components/table/reservations-table";

export default function DashboardReservationPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium lg:text-3xl">Reservasi</h1>
      <ReservationsTable />
    </div>
  );
}
