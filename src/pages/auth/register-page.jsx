import { useSession } from "@/provider/session-provider";
import { Navigate } from "react-router-dom";
import RegisterForm from "@/components/form/auth/register-form";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/navigation/base-header";

export default function RegisterPage() {
  const { user } = useSession();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-2 p-2 lg:p-0">
      {/* <Header auth_section={false} /> */}
      <div className="flex items-center justify-center w-full mb-0">
      <Link to={'/'}>
          <img src="/logo.png" alt="Logo" className="h-14 lg:h-16" />
        </Link>
        </div>
      <RegisterForm />
      {/* <Link to="/" className={cn(buttonVariants({ variant: "link" }))}>
        Kembali
      </Link> */}
    </main>
  );
}
