import { reservationService } from "@/services/reservation-service";
import { useQuery } from "@tanstack/react-query";
import Loading from "../ui/loading";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, dateFormat, timeFormat } from "@/lib/utils";
import { Badge } from "../ui/badge";
import SetReservationSuccess from "../reservations/set-reservation-success";
import SetReservationCancel from "../reservations/set-reservation-cancel";
import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { ChevronLeft, ChevronRight, Info, Search } from "lucide-react";

export default function ReservationsTable() {
  const {
    data: reservations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => reservationService.getReservations(),
    queryKey: ["reservations"],
  });

  const [tableFilter, setTableFilter] = useState({
    search: '',
    page: 1,
    per_page: 5
  })
  
  const aksi = {
    tableFilter: {
      set: (column, value) => {
        setTableFilter((state) => ({
          ...state,
          [column]: column === "search" ? String(value) : parseInt(value),
        }));
      },
      page: {
        total: () => {

        },
        goto: (page) => {
          setTableFilter((state) => ({ ...state, page }));
        },
        back: () => {
          setTableFilter((state) => ({
            ...state,
            page: Math.max(1, state.page - 1),
          }));
        },
        next: () => {
          setTableFilter((state) => ({
            ...state,
            page: state.page + 1,
          }));
        },
        hasNext: () => {
          let filteredData = reservations.data

          if(tableFilter.search !== '') {
            filteredData = filteredData.filter(item => aksi.tableFilter.toFiltered(item, ['name']))
          }

          const totalPages = Math.ceil(filteredData.length / tableFilter.per_page);
          return tableFilter.page >= totalPages;
        },
        hasBack: () => tableFilter.page <= 1,
      },
      search: {
        submit: (e) => {
          e.preventDefault();
          const search = e.target[0].value;
          setTableFilter((state) => ({
            ...state,
            search,
            page: 1, // Reset to page 1 on search
          }));
        },
      },
      toFiltered: (item, columns = []) => {
        if (!tableFilter.search.trim()) return true; // If no search query, include all items
        const searchQuery = tableFilter.search.toLowerCase();
      
        const getNestedValue = (obj, path) => {
          return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };
      
        return columns.some((column) => {
          const value = column.includes(".")
            ? String(getNestedValue(item, column) || "").toLowerCase()
            : String(item[column] || "").toLowerCase();
          return value.includes(searchQuery);
        });
      },
      toSliced: () => {
        const startIndex = (tableFilter.page - 1) * tableFilter.per_page;
        const endIndex = startIndex + tableFilter.per_page;
        return [startIndex, endIndex]
      },
      numbering: (index) => {
        return (tableFilter.page - 1) * tableFilter.per_page + index + 1
      },
      filtered_data: () => {
        if (!reservations) return [];
        let data = reservations.data;

        if (tableFilter.search.trim()) {
          const searchQuery = tableFilter.search.toLowerCase();
          data = data.filter((item) =>
            aksi.tableFilter.toFiltered(item, ["name"])
          );
        }
        return data;
      }
    },
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    console.log({
      data
    })
    return <p>{error.message}</p>;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-5">
        <form onSubmit={e => aksi.tableFilter.search.submit(e)} className="flex items-center gap-3 w-full sm:w-1/2">
          <div className="relative w-4/5">
            <Input placeholder="Cari disini" />
            <div className="absolute top-0 right-0 w-fit h-full flex items-center justify-end p-1">
              <button type="submit" className="bg-primary flex justify-center items-center rounded text-white hover:bg-primary/80 ease-out duration-100 w-9 h-9">
                <Search size={20} />
              </button>
            </div>
          </div>
          <div className="w-1/5">
            <select value={tableFilter.per_page} onChange={e => aksi.tableFilter.set('per_page', e.target.value)} className="w-full border p-2 rounded-md hover:bg-zinc-100 cursor-pointer text-sm">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={999}>Semua</option>
            </select>
          </div>
        </form>

        {/* Pagination */}
        {reservations.data.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-0.5 rounded-md bg-white text-zinc-500 disabled:bg-zinc-100 border hover:bg-primary hover:disabled:bg-zinc-100 hover:text-white hover:disabled:text-zinc-500 active:bg-orange-700 active:scale-95 active:disabled:scale-100 ease-out duration-100"
              disabled={aksi.tableFilter.page.hasBack()}
              onClick={aksi.tableFilter.page.back}
            >
              <ChevronLeft />
            </button>

            {(() => {
              const totalPages = Math.ceil(aksi.tableFilter.filtered_data().length / tableFilter.per_page);
              const currentPage = tableFilter.page;
              const pageNumbers = [];

              if (totalPages <= 5) {
                // Show all pages if the total number is 5 or less
                for (let i = 1; i <= totalPages; i++) {
                  pageNumbers.push(i);
                }
              } else {
                // Always show the first page
                pageNumbers.push(1);

                // Add ellipsis if needed before the range
                if (currentPage > 3) {
                  pageNumbers.push("...");
                }

                // Show up to 2 pages before and after the current page
                const startPage = Math.max(2, currentPage - 1);
                const endPage = Math.min(totalPages - 1, currentPage + 1);

                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i);
                }

                // Add ellipsis if needed after the range
                if (currentPage < totalPages - 2) {
                  pageNumbers.push("...");
                }

                // Always show the last page
                pageNumbers.push(totalPages);
              }

              return pageNumbers.map((page, index) =>
                typeof page === "string" ? (
                  <span key={`ellipsis-${index}`} className="w-7 h-7 flex items-center justify-center">
                    {page}
                  </span>
                ) : (
                  <button
                    type="button"
                    key={page}
                    onClick={() => aksi.tableFilter.page.goto(page)}
                    className={`${
                      tableFilter.page === page
                        ? "bg-primary text-white active:scale-95 active:bg-orange-700 ease-out duration-100"
                        : "border"
                    } w-7 h-7 flex items-center justify-center rounded-md`}
                  >
                    {page}
                  </button>
                )
              );
            })()}

            <button
              type="button"
              className="p-0.5 rounded-md bg-white text-zinc-500 disabled:bg-zinc-100 border hover:bg-primary hover:disabled:bg-zinc-100 hover:text-white hover:disabled:text-zinc-500 active:bg-orange-700 active:scale-95 active:disabled:scale-100 ease-out duration-100"
              disabled={aksi.tableFilter.page.hasNext()}
              onClick={aksi.tableFilter.page.next}
            >
              <ChevronRight />
            </button>
          </div>
        )}

      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">No</TableHead>
            <TableHead className="w-32 text-center">ID Reservasi</TableHead>
            <TableHead className="w-36 text-center">Customer</TableHead>
            <TableHead className="w-40 text-center">Tanggal</TableHead>
            <TableHead className="w-16 text-center">Waktu</TableHead>
            <TableHead className="text-center">Kategori</TableHead>
            <TableHead className="text-center">Paket</TableHead>
            <TableHead className="w-32 text-center">Status</TableHead>
            <TableHead className="w-48 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.data.length > 0 ? (
            reservations.data.filter(item => aksi.tableFilter.toFiltered(item, ['user.name', 'date', 'timeSlot.time', 'category.name', 'categoryPackage.name'])).slice(...aksi.tableFilter.toSliced()).map((reservation, index) => {
              const rsrvStatus =
                reservation.status === "success"
                  ? "Selesai"
                  : reservation.status === "cancelled"
                    ? "Dibatalkan"
                    : "Proses";

              const isCancelled = rsrvStatus === "Dibatalkan";
              const isSuccess = rsrvStatus === "Selesai";

              return (
                <TableRow key={index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{reservation.id}</TableCell>
                  <TableCell className="text-center">
                    {reservation.user.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {dateFormat(reservation.date)}
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
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      <div
                        className={cn(
                          "bg-yellow-500 px-2 py-1 rounded-full text-white text-sm w-fit",
                          isSuccess && "bg-green-500 px-2 py-1 rounded-full text-white text-sm w-fit",
                          isCancelled && "bg-red-500 px-2 py-1 rounded-full text-white text-sm w-fit",
                        )}
                      >
                        {rsrvStatus}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className=" text-center">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {reservation.status === "pending" ? (
                        <div className="inline-flex gap-2">
                          <SetReservationCancel id={reservation.id} />
                          {reservation.transactions.status === "paid" && (
                            <SetReservationSuccess id={reservation.id} />
                          )}
                        </div>
                      ) : null}
                      {reservation.status === "success" && (
                        <Link
                          to={`/dashboard/reservations/${reservation.id}/detail`}
                          className={`bg-primary w-9 h-9 flex items-center justify-center text-white rounded-sm hover:bg-primary/70 ease-out duration-100`}
                          >
                          <Info width={20} />
                        </Link>
                        
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
