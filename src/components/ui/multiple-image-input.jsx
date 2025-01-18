import * as React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const MultipleImageInput = React.forwardRef(
  ({ className, value, onChange, ...props }, ref) => {
    const handleFileSelected = (e) => {
      if (e.target.files) {
        const _files = Array.from(e.target.files);
        Promise.all(
          _files.map((file) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target && typeof e.target.result === "string") {
                  resolve(e.target.result);
                }
              };
              reader.readAsDataURL(file);
            });
          }),
        ).then((fileURLs) => {
          onChange([...fileURLs]);
        });
      }
    };

    return (
      <div className={cn("flex min-h-10 w-full flex-col gap-2", className)}>
        <div className="flex flex-row flex-wrap items-start gap-4">
          {value.map((src, index) => (
            <div className="relative flex w-48" key={index}>
              <img
                src={src}
                alt="Fish Image"
                className="w-48 rounded-md object-cover"
              />
            </div>
          ))}
        </div>
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={handleFileSelected}
          type="file"
          multiple
          accept="image/*"
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);

MultipleImageInput.displayName = "MultipleImageInput";

MultipleImageInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export { MultipleImageInput };
