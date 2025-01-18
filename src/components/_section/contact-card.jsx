import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";

export const ContactCard = (props) => {
  const { icon: Icon, title, description, link } = props;
  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success(`Nomor telepon ${description} berhasil disalin`);
  };

  return (
    <>
      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Card */}
      {link ? (
        <a href={link} target="_blank">
          <Card className="mb-5 h-32 w-[350px] cursor-pointer bg-primary shadow-md hover:bg-yellow-700 md:w-96">
            <CardHeader className="p-0">
              <CardTitle />
              <CardDescription />
            </CardHeader>
            <CardContent className="flex justify-start p-10 text-sm">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <Icon className="m-2 h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">{title}</h3>
                <p className="text-white">{description}</p>
              </div>
            </CardContent>
            <CardFooter />
          </Card>
        </a>
      ) : (
        <div onClick={handleCopy}>
          <a href={link} target="_blank">
            <Card className="mb-5 h-32 w-[350px] cursor-pointer bg-primary shadow-md hover:bg-yellow-700 md:w-96">
              <CardHeader className="p-0">
                <CardTitle />
                <CardDescription />
              </CardHeader>
              <CardContent className="flex justify-start p-10 text-sm">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                  <Icon className="m-2 h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">{title}</h3>
                  <p className="text-white">{description}</p>
                </div>
              </CardContent>
              <CardFooter />
            </Card>
          </a>
        </div>
      )}
    </>
  );
};
