import PropTypes from "prop-types";

export default function CategoryImagesDisplay({ categoryImages }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 lg:gap-8 lg:px-20">
      {categoryImages.length === 1 ? (
        <img
          src={categoryImages[0]}
          alt="Category Image"
          className="h-[512px] object-cover"
        />
      ) : categoryImages.length === 2 ? (
        <div className="grid h-[512px] w-full grid-cols-2 gap-8">
          <img
            src={categoryImages[0]}
            alt="Category Image"
            className="h-full object-cover"
          />
          <img
            src={categoryImages[1]}
            alt="Category Image"
            className="h-full object-cover"
          />
        </div>
      ) : (
        categoryImages.length === 3 && (
          <div className="grid grid-cols-1 grid-rows-4 items-center gap-2 overflow-hidden rounded-3xl md:grid-cols-6 lg:grid-cols-8 lg:gap-6">
            <img
              src={categoryImages[0]}
              alt="Category Image"
              className="row-span-4 h-full object-cover md:col-span-4 lg:col-span-5"
            />
            <img
              src={categoryImages[1]}
              alt="Category Image"
              className="row-span-2 object-cover md:col-span-2 lg:col-span-3"
            />
            <img
              src={categoryImages[2]}
              alt="Category Image"
              className="row-span-2 object-cover md:col-span-2 lg:col-span-3"
            />
          </div>
        )
      )}
    </div>
  );
}

CategoryImagesDisplay.propTypes = {
  categoryImages: PropTypes.array.isRequired,
};
