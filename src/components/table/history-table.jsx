import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { reservationService } from "@/services/reservation-service";
import Loading from "../ui/loading";
import { cn, dateFormat, timeFormat } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";

export default function HistoryTable() {
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => reservationService.getUserReservation(),
    queryKey: ["reservations"],
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  if (!data || data.data.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Tanggal</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Waktu</TableHead>
            <TableHead className="text-center">Kategori</TableHead>
            <TableHead className="text-center">Paket</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-muted-foreground"
            >
              Tidak ada data
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-60 text-center">Tanggal</TableHead>
          <TableHead className="w-32 text-center">ID Reservasi</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Waktu</TableHead>
          <TableHead className="text-center">Kategori</TableHead>
          <TableHead className="text-center">Paket</TableHead>
          <TableHead className="w-72 text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.data.map((reservation) => {
          const rsrvStatus =
            reservation.status === "success"
              ? "Selesai"
              : reservation.status === "cancelled"
                ? "Dibatalkan"
                : "Sedang diproses";

          const isCancelled = rsrvStatus === "Dibatalkan";
          const isSuccess = rsrvStatus === "Selesai";
          return (
            <TableRow key={reservation.id}>
              <TableCell className="text-center">
                {dateFormat(reservation.date)}
              </TableCell>
              <TableCell className="text-center">{reservation.id}</TableCell>
              <TableCell className="text-center capitalize flex justify-center items-center">
                <div
                  className={cn(
                    "bg-yellow-500 px-2 py-1 ",
                    isSuccess && "bg-green-500 px-2 py-1 ",
                    isCancelled && "bg-red-500 px-2 py-1 ",
                    "rounded-full text-white text-sm w-fit"
                  )}
                >
                  {rsrvStatus}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {timeFormat(reservation.timeSlot.time)}
              </TableCell>
              <TableCell className="text-center">
                {reservation.category.name}
              </TableCell>
              
              <TableCell className="text-center">
                {reservation.categoryPackage.name}
              </TableCell>
              <TableCell className="">
                <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                  {reservation.status === "success" &&
                    (reservation.review.length > 0 ? (
                      <Link
                        to={`/review/${reservation.id}/detail`}
                        className={cn(buttonVariants({ size: "sm" }), "mr-2")}
                      >
                        Lihat Ulasan
                      </Link>
                    ) : (
                      <Link
                        to={`/review/${reservation.id}`}
                        className={cn(buttonVariants({ size: "sm" }), "mr-2")}
                      >
                        Beri Ulasan
                      </Link>
                    ))}
                  <Link
                    to={`/payment/${reservation.transactions.id}`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    Pembayaran
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
