import { useSession } from "@/provider/session-provider";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "../icons";

export default function AuthenticatedLayout() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
