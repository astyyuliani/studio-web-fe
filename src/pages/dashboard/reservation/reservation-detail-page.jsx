import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { cn, dateFormat, rupiahFormat, timeFormat } from "@/lib/utils";
import { reservationService } from "@/services/reservation-service";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ReservationDetailPage() {
  const { reservationId } = useParams();

  const {
    data: reservation,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => reservationService.getReservation(reservationId),
    queryKey: ["reservation", reservationId],
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const rsrvStatus =
    reservation.status === "success"
      ? "Selesai"
      : reservation.status === "cancelled"
        ? "Dibatalkan"
        : "Pending";

  const isCancelled = rsrvStatus === "Dibatalkan";
  const isSuccess = rsrvStatus === "Selesai";

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/dashboard/reservations"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Kembali
      </Link>
      <h1 className="text-lg font-medium lg:text-3xl">Detail Reservasi</h1>
      <div className="flex flex-col gap-2 lg:w-3/4">
        <div className="grid grid-cols-2">
          <p>Status</p>
          <div
            className={cn(
              "bg-yellow-500 px-2 py-1 rounded-full text-white text-sm w-fit",
              isSuccess && "bg-green-500 px-2 py-1 rounded-full text-white text-sm w-fit",
              isCancelled && "bg-red-500 px-2 py-1 rounded-full text-white text-sm w-fit",
              "max-w-max",
            )}
          >
            {rsrvStatus}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2">
          <p>ID Reservasi</p>
          <p>{reservation.data.id}</p>
        </div>
        <div className="grid grid-cols-2">
          <p>Tanggal</p>
          <p>{dateFormat(reservation.data.date)}</p>
        </div>
        <div className="grid grid-cols-2">
          <p>Waktu</p>
          <p>{timeFormat(reservation.data.timeSlot.time)}</p>
        </div>
        <div className="grid grid-cols-2">
          <p>Kategori</p>
          <p>{reservation.data.category.name}</p>
        </div>
        <div className="mt-4 space-y-2">
          <p>Paket</p>
          <div className="grid grid-cols-2">
            <p>{reservation.data.categoryPackage.name}</p>
            <p>{rupiahFormat(reservation.data.categoryPackage.price)}</p>
          </div>
        </div>
        {reservation.data.reservation_detail.length > 0 && (
          <div className="mt-4 space-y-2">
            <p>Tambahan</p>
            {reservation.data.reservation_detail.map((addon) => (
              <div className="grid grid-cols-2" key={addon.id}>
                <p>
                  {addon.categoryAddon.name} x{addon.quantity}
                </p>
                <p>
                  {rupiahFormat(addon.categoryAddon.price * addon.quantity)}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2">
          <p>Total</p>
          <p>{rupiahFormat(reservation.data.total)}</p>
        </div>
        <div className="mt-4 space-y-2">
          <p>Customer</p>
          <div className="grid grid-cols-2">
            <p>Nama</p>
            <p>{reservation.data.user.name}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Email</p>
            <p>{reservation.data.user.email}</p>
          </div>
          <div className="grid grid-cols-2">
            <p>Nomor HP</p>
            <p>{reservation.data.user.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
