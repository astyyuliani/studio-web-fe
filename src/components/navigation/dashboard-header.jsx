import { PanelRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { sidebarLinks } from "./constant";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarLogout } from "./dashboard-sidebar";
import { useLocation } from "react-router-dom";

export default function DashboardHeader() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-10 flex w-full bg-white shadow-lg lg:hidden">
      <div className="mx-auto h-16 w-full max-w-[1440px] px-4 font-medium lg:px-20">
        <nav className="inline-flex h-full w-full items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="flex lg:hidden">
                <PanelRight />
              </Button>
            </SheetTrigger>
            <SheetContent className="min-h-dvh w-3/4 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
                <SheetDescription className="hidden">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
              <ul className="mt-4 flex flex-col gap-2">
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
                          "inline-flex w-full items-center gap-4 hover:text-primary/90",
                          isActive && "text-primary",
                        )}
                      >
                        <Icon className="size-5" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                <SidebarLogout />
              </ul>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
