import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "./constant";
import { cn } from "@/lib/utils";
import { useSession } from "@/provider/session-provider";
import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export default function DashboardSidebar() {
  const location = useLocation();

  return (
    <div className="z-50 hidden border-r-2 bg-secondary lg:fixed lg:block lg:h-screen lg:w-72">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex min-h-20 w-full items-center justify-center border-b-2 bg-white">
        <Link to={'/'}>
          <img src="/logo.png" alt="Logo" className="h-9 lg:h-12" />
        </Link>
          {/* <img src="/logo.png" alt="Logo" /> */}
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start gap-4 p-6 text-sm font-medium">
            <ul className="flex flex-col gap-2">
              {sidebarLinks.map((link, index) => {
                const Icon = link.icon;

                const isActive =
                  link.path === "/dashboard" &&
                  location.pathname === "/dashboard"
                    ? true
                    : link.path !== "/dashboard" &&
                      location.pathname.startsWith(link.path);

                return (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className={cn(
                        "inline-flex w-full items-center gap-4 rounded-md p-4 transition-colors duration-100 hover:bg-primary/90 hover:text-white",
                        isActive && "bg-primary text-white",
                      )}
                    >
                      <Icon className="size-6" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <SidebarLogout />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export function SidebarLogout() {
  const { logout } = useSession();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="inline-flex w-full items-center gap-4 hover:text-destructive lg:h-14 lg:px-4">
          <LogOut className="size-5 lg:size-6" />
          Logout
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-8 p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center lg:text-4xl">
            Apakah anda yakin untuk keluar?
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center justify-center gap-2 lg:justify-center">
          <AlertDialogCancel className="m-0">Batal</AlertDialogCancel>
          <AlertDialogAction
            className="m-0 bg-primary hover:bg-primary/70 ease-out duration-100"
            onClick={logout}
          >
            Keluar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
