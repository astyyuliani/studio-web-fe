import { useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { categoryService } from "@/services/category-service";
import { Link, useSearchParams } from "react-router-dom";
import Loading from "../ui/loading";
import DeleteCategory from "../category/delete-category";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useState } from "react";
import { ButtonIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function CategoriesTable() {

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
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
          let filteredData = categories.data

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
        if (!categories) return [];
        let data = categories.data;

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

  if (!categories || categories.data.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24 text-center">No</TableHead>
            <TableHead className="text-center">Nama Kategori</TableHead>
            <TableHead className="text-center">Foto</TableHead>
            <TableHead className="w-48 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={4}
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
    <div className="">
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
        {categories.data.length > 0 && (
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
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="hidden text-center lg:table-cell">
              Foto
            </TableHead>
            <TableHead className="w-48 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(categories.data) && categories.data.filter(item => aksi.tableFilter.toFiltered(item, ['name', 'deskripsi'])).slice(...aksi.tableFilter.toSliced()).map((category, index) => (
            <TableRow key={category.id}>
              <TableCell className="text-center">
                {(tableFilter.page - 1) * tableFilter.per_page + index + 1}
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.deskripsi}</TableCell>
              <TableCell className="hidden lg:table-cell">
                <img
                  src={category.images[0]}
                  alt={`${category.name} Image`}
                  className="mx-auto h-32 w-48 object-cover"
                  />
                </TableCell>
                <TableCell className="">
                  <div className="flex items-center justify-center gap-2 text-center">
                    <Link
                      to={`/dashboard/categories/${category.id}`}
                      className={`bg-primary w-9 h-9 flex items-center justify-center text-white rounded-sm hover:bg-primary/70 ease-out duration-100`}
                    >
                      <Pencil2Icon width={20} height={20} />
                    </Link>
                    <DeleteCategory categoryId={category.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
