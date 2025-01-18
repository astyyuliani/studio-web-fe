import { Spinner } from "../icons";

export default function Loading() {
  return (
    <div className="flex h-80 w-full items-center justify-center">
      <Spinner className="size-6" />
    </div>
  );
}
