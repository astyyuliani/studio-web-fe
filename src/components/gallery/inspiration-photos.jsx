export default function InspirationPhotos() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <h2 className="text-center text-xl font-medium lg:text-2xl">
        Inspirasi Foto
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4">
        <img
          src="/gallery/inspiration/1.png"
          alt="Foto Populer"
          className="h-[254px] w-[171.5px] object-cover lg:h-[412px] lg:w-[320px]"
        />
        <img
          src="/gallery/inspiration/2.png"
          alt="Foto Populer"
          className="h-[254px] w-[171.5px] object-cover lg:h-[412px] lg:w-[320px]"
        />
        <img
          src="/gallery/inspiration/3.png"
          alt="Foto Populer"
          className="h-[254px] w-[171.5px] object-cover lg:h-[412px] lg:w-[320px]"
        />
        <img
          src="/gallery/inspiration/4.png"
          alt="Foto Populer"
          className="h-[254px] w-[171.5px] object-cover lg:h-[412px] lg:w-[320px]"
        />
      </div>
    </div>
  );
}
