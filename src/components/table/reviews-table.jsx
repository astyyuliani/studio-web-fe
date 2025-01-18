import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { reviewService } from "@/services/review-service";
import Loading from "../ui/loading";
import { useState } from "react";
import { Input } from "../ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function ReviewsTable() {
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => reviewService.getReviews(),
    queryKey: ["reviews"],
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
          let filteredData = reviews.data

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
        if (!reviews) return [];
        let data = reviews.data;

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
        {reviews.data.length > 0 && (
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
            <TableHead className="w-36">Customer</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Paket</TableHead>
            <TableHead>Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.data.length > 0 ? (
            reviews.data.filter(item => aksi.tableFilter.toFiltered(item, ['user.name', 'reservation.category.name', 'reservation.categoryPackage.name', 'review'])).slice(...aksi.tableFilter.toSliced()).map((review, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">
                  {review.reservation.id}
                </TableCell>
                <TableCell>{review.user.name}</TableCell>
                <TableCell>{review.reservation.category.name}</TableCell>
                <TableCell>{review.reservation.categoryPackage.name}</TableCell>
                <TableCell className="max-w-56 truncate whitespace-pre-line">
                  {review.review}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
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
