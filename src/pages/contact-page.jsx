import { ContactCard } from "@/components/_section/contact-card";
import {
  IoCall,
  IoLocation,
  IoLogoInstagram,
  IoLogoWhatsapp,
} from "react-icons/io5";

export default function ContactPage() {
  return (
    <main className="flex w-full flex-col items-center justify-center gap-10 py-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-20 px-20">
        <h1 className="text-center text-2xl font-semibold md:text-4xl">
          Hubungi Kami
        </h1>

        <div className="flex columns-2 flex-wrap items-center justify-center gap-5">
          <div className="flex columns-2 flex-wrap items-center justify-center gap-5">
            <ContactCard
              icon={IoCall}
              title="Nomor Telepon"
              description="+62 823-26400-060"
            />
            <ContactCard
              icon={IoLogoInstagram}
              title="Instagram"
              description="Studio Foto Infokus"
              link="https://www.instagram.com/studiofotoinfokus/"
            />

          </div>
          <div className="flex columns-2 flex-wrap items-center justify-center gap-5">
            <ContactCard
              icon={IoLogoWhatsapp}
              title="WhatsApp"
              description="+62 823-26400-060"
              link="https://wa.me/c/6282326400060"
            />
            <ContactCard
              icon={IoLocation}
              title="Alamat"
              description="Jl. Gn. Muria No.71, Brubahan, Grendeng."
              link="https://maps.app.goo.gl/9hPLScv32DTRcTkH8"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
