import { Link } from "react-router-dom";
import { buttonVariants } from "../ui/button";

export default function HeroSection() {
  return (
    <div className="relative h-80 w-full md:h-[600px]">
      <div className="flex items-center justify-center bg-primary opacity-40">
        <img
          src="/bg-hero.png"
          alt="hero"
          className="h-80 w-full object-cover md:h-[600px]"
        />
      </div>
      <div className="absolute top-0 flex h-full w-full">
        <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col items-center justify-between p-10 px-4 md:items-start md:p-20">
          <h1 className="max-w-[720px] text-center text-3xl font-medium md:text-left lg:text-6xl">
            Temukan <span className="text-primary">studio foto</span> yang kamu
            inginkan
          </h1>
          <p className="text-center text-lg md:w-[600px] md:text-left md:text-xl">
            Cari dan booking paket foto dengan berbagai fasilitas sekarang juga.
          </p>
          <Link
            to="/category"
            className={buttonVariants({
              className: "h-auto w-52 rounded-md py-3",
            })}
          >
            <p className="text-base" >Lihat selengkapnya</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
