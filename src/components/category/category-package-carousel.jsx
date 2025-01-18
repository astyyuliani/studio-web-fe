import PropTypes from "prop-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { cn, rupiahFormat } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { useSession } from "@/provider/session-provider";
import { Link } from "react-router-dom";

export default function CategoryPackageCarousel({ categoryPackages }) {
  const { user } = useSession();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-20">
      <Carousel className="mx-auto w-full">
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl lg:text-4xl">
              Pilihan Paket Yang Tersedia
            </h2>
            <p className="text-muted-foreground lg:text-2xl">
              Kami menawarkan Paket Foto yang sudah di sesuai dengan kebutuhan
              Anda.
            </p>
          </div>
          <div className="flex flex-row gap-2 lg:gap-4">
            <CarouselPrevious className="text-medium left-0 top-0 h-8 w-8 translate-y-0 rounded-md border-none bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground lg:h-14 lg:w-14" />
            <CarouselNext className="text-medium right-0 top-0 h-8 w-8 translate-y-0 rounded-md border-none bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground lg:h-14 lg:w-14" />
          </div>
        </div>
        <CarouselContent className="-ml-8 mt-10">
          {categoryPackages.map((pack) => (
            <CarouselItem key={pack.id} className="pl-8 lg:max-w-96">
              <Card className="border-2">
                <CardContent className="flex flex-col items-center justify-center gap-4 p-6 lg:gap-8 lg:p-12">
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="font-light lg:text-2xl">{pack.name}</h3>
                    <h3 className="font-medium lg:text-2xl">
                      {rupiahFormat(pack.price)}
                    </h3>
                  </div>
                  <p className="whitespace-pre-line text-center">
                    {pack.description}
                  </p>

                  {user && user.role === "user" ? (
                    <Link
                      to={`/reservation/${pack.id}`}
                      className={cn(buttonVariants(), "w-full font-bold")}
                    >
                      Pilih Paket
                    </Link>
                  ) : null}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

CategoryPackageCarousel.propTypes = {
  categoryPackages: PropTypes.array.isRequired,
};
