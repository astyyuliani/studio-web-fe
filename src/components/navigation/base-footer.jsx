import { links, contacts } from "./constant";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <div className="mt-10 w-full border-t border-gray-700">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:p-20">
          <div className="flex max-w-md flex-col items-start gap-4 lg:gap-12">
            <h3 className="text-2xl font-extrabold">Infokus.</h3>
            <p className="text-gray-500">
              Jl. Gn. Muria No.71, Brubahan, Grendeng, Kec. Purwokerto Utara,
              Kabupaten Banyumas, Jawa Tengah 53122
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-max lg:gap-4">
            <h4>Menu</h4>
            <div className="flex flex-row gap-2 lg:flex-col lg:gap-4">
              {links.map((link, index) => (
                <Link key={index} to={link.path} className="text-gray-500">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4>Sosial Media</h4>
            {contacts.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <p key={index} className="inline-flex items-center">
                  <Icon className="mr-2 h-6 w-6" />
                  {contact.social}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full border-t border-gray-700">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center p-3">
          <p>2024 Infokus. All rights reverved</p>
        </div>
      </div>
    </>
  );
}
