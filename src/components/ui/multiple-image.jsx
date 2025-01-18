import * as React from "react";
import PropTypes from "prop-types";
import { XIcon } from "lucide-react";

// Assuming you have these components in your project
// If not, you'll need to implement or import them from your UI library
import { Button } from "@/components/ui/button";

// Assuming you have this utility function
// If not, you'll need to implement it or use an alternative
import { cn } from "@/lib/utils";

const MultipleImage = React.forwardRef(
  ({ className, value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <div className={cn("flex min-h-10 w-full flex-col gap-2", className)}>
        <div className="flex flex-row flex-wrap items-start gap-4">
          {value.map((item) => (
            <div
              className="relative flex w-48 items-center justify-center"
              key={item}
            >
              <img
                src={item}
                alt="Fish Image"
                className="w-48 rounded-md object-cover"
              />
              <div className="absolute right-1 top-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute h-4 w-4"
                  onClick={() => {
                    onChange(value.filter((i) => i !== item));
                  }}
                >
                  <XIcon className="w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <input
          className="hidden h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);

MultipleImage.displayName = "MultipleImage";

MultipleImage.propTypes = {
  className: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export { MultipleImage };
