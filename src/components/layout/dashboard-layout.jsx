import { useSession } from "@/provider/session-provider";
import DashboardSidebar from "../navigation/dashboard-sidebar";
import { Spinner } from "../icons";
import { Navigate, Outlet } from "react-router-dom";
import DashboardHeader from "../navigation/dashboard-header";

export default function DashboardLayout() {
  const { user, isLoading } = useSession();

  if (!isLoading && (!user || user.role !== "admin")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar />
      <div className="lg:ml-72">
        <DashboardHeader />
        <main className="p-4">
          {isLoading ? (
            <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
              <Spinner className="h-16 w-16" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
