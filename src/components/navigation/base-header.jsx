import { Link, useLocation } from "react-router-dom";
import { links } from "./constant";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { useSession } from "@/provider/session-provider";
import { Spinner } from "../icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PanelRight } from "lucide-react";
import { UserCircle2 } from "lucide-react";

export default function Header({
  auth_section = true,
  icon_only = false,
  icon_position = 'center'
}) {
  const location = useLocation();
  const { user, isLoading } = useSession();
  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      <div className="mx-auto h-16 w-full max-w-[1440px] px-4 font-medium lg:h-20 lg:px-20">
        <nav className="inline-flex h-full w-full items-center justify-between">
          <Link to={'/'}>
            <img src="/logo.png" alt="Logo" className="h-9 lg:h-12" />
          </Link>
          {/* <p className="text-3xl h-3 lg:h-10">Infokus</p> */}
          <ul className="hidden gap-11 lg:inline-flex">
            {links.map((link, index) => {
              const isActive =
                link.path === "/" && location.pathname === "/"
                  ? true
                  : link.path !== "/" &&
                    location.pathname.startsWith(link.path);

              return (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={cn(
                      "font-medium text-black transition-colors duration-300 ease-in-out hover:text-primary/90",
                      isActive && "text-primary hover:text-primary/90",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {auth_section && (
            <div className="hidden items-center gap-5 lg:inline-flex">
              {isLoading && <Spinner className="h-6 w-6" />}
              {!user && (
                <>
                <Link
                    to="/login"
                    className={cn(
                      buttonVariants({
                        variant:"line",
                        size: "lg",
                      }),
                      "font-bold",
                    )}
                  >
                    Masuk
                  </Link>
                  
                  <Link
                    to="/register"
                    className={cn(
                      buttonVariants({
                        size: "lg",
                      }),
                      "font-bold",
                    )}
                  >
                    Daftar
                  </Link>
                
                </>
              )}
              {user && <ProfileMenu />}
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="flex lg:hidden">
                <PanelRight />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-3/4">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
                <SheetDescription className="hidden">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <ul className="flex flex-col gap-2">
                  {links.map((link, index) => {
                    const isActive =
                      link.path === "/" && location.pathname === "/"
                        ? true
                        : link.path !== "/" &&
                          location.pathname.startsWith(link.path);

                    return (
                      <li key={index}>
                        <Link
                          to={link.path}
                          className={cn(
                            "font-medium text-black transition-colors duration-300 ease-in-out hover:text-primary/90",
                            isActive && "text-primary hover:text-primary/90",
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex flex-col gap-2">
                  {auth_section && (
                    <>
                      {isLoading && <Spinner className="h-6 w-6" />}
                      {!user && (
                        <>
                          <Link to="/login">Masuk</Link>
                          <Link to="/register">Daftar</Link>
                          
                        </>
                      )}
                    </>
                  )}
                  {user && (
                    <>
                      {user.role === "admin" && (
                        <Link to="/dashboard/today-schedule">Dashboard</Link>
                      )}
                      {user.role !== "admin" && (
                        <>
                          <Link to="/profile">Profil</Link>
                          <Link to="/history">Riwayat</Link>
                        </>
                      )}
                      <MobileLogout />
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}

function ProfileMenu() {
  const { user, logout } = useSession();

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="hidden lg:flex" variant="ghost">
            <UserCircle2 size={28} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {user.role === "admin" && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/today-schedule">Dashboard</Link>
              </DropdownMenuItem>
            </>
          )}
          {user.role !== "admin" && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/profile">Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/history">Riwayat</Link>
              </DropdownMenuItem>
            </>
          )}
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive">
              Logout
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="space-y-8 p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-4xl">
            Apakah anda yakin untuk keluar?
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center justify-center sm:justify-center">
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={logout} className={`bg-primary hover:bg-primary/80`}>
            Keluar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MobileLogout() {
  const { logout } = useSession();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <p className="text-destructive">Logout</p>
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-4 p-8 lg:space-y-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl lg:text-4xl">
            Apakah anda yakin untuk keluar?
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center justify-center gap-2">
          <AlertDialogCancel className="m-0">Batal</AlertDialogCancel>
          <AlertDialogAction onClick={logout} className={`bg-primary hover:bg-primary/80`}>
            Keluar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
