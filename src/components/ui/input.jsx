import * as React from "react";
import PropTypes from "prop-types";
import { Button } from "./button";
import { EyeOff, Eye } from "lucide-react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex w-full flex-row items-center">
      <input
        type={type === "password" && showPassword ? "text" : type}
        className={cn(
          "flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:font-semibold placeholder:text-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          type === "password" && "pr-10",
          className,
        )}
        ref={ref}
        {...props}
      />
      {type === "password" && (
        <div className="absolute right-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:bg-transparent"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            ) : (
              <Eye
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };

Input.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
};
