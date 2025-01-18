import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

export default function InstagramIcon({ className, ...props }) {
  return (
   
    <svg
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("h-4 w-4", className)}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
        ></path>
        <path d="M3 16V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m17.5 6.51l.01-.011"
        ></path>
      </g>
    </svg>
  );
}

InstagramIcon.propTypes = {
  className: PropTypes.string,
};
