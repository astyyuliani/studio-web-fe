import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import { useSession } from "@/provider/session-provider";

export default function ProfilePage() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="mx-auto flex flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-6 lg:px-20 lg:py-10">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Nama</h2>
                <p>{user.name}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Email</h2>
                <p>{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
