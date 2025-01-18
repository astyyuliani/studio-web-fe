import CreateReservationForm from "@/components/form/reservation/create-reservation-form";
import { ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ReservationPage() {
  const { categoryPackageId } = useParams();

  return (
    <main className="mx-auto flex flex-col items-center justify-center gap-10">
      <div className="h-16 w-full bg-secondary lg:h-24">
        <div className="mx-auto flex h-full w-full max-w-[1440px] flex-row items-center px-4 lg:px-20">
          <div className="inline-flex gap-4">
            <Link
              to="/"
              className="text-gray-500 transition-colors duration-200 hover:text-primary"
            >
              Beranda
            </Link>
            <ChevronRight />
            <Link
              to="/category"
              className="text-gray-500 transition-colors duration-200 hover:text-primary"
            >
              Kategori
            </Link>
            <ChevronRight />
            <p className="text-gray-500">Reservasi</p>
          </div>
        </div>
      </div>
      <CreateReservationForm categoryPackageId={categoryPackageId} />
    </main>
  );
}
