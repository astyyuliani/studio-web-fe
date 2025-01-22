import PropTypes from "prop-types";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { packageService } from "@/services/package-service";
import { Trash } from "lucide-react";

export default function DeletePackage({ packageId }) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isError, setIsError] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => packageService.deletePackage(packageId),
    onSuccess: (data) => {
      toast(data.message);
      queryClient.invalidateQueries("packages");
      setIsSubmit(false);
    },
    onError: (error) => {
      setIsError(error.message);
      setIsSubmit(false);
    },
  });

  async function handleDelete() {
    setIsSubmit(true);
    setIsError("");

    try {
      await deleteMutation.mutateAsync();
      setIsOpen(false);
    } catch (error) {
      setIsError(error.message);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="bg-red-500 text-white w-9 h-9 flex items-center justify-center rounded-sm hover:bg-red-500/80 ease-out duration-100">
          <Trash size={20} />  
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {isError && (
            <Alert variant="error">
              <AlertDescription>{isError}</AlertDescription>
            </Alert>
          )}
          <DialogTitle>Apakah anda yakin?</DialogTitle>
          <DialogDescription>
            Apakah anda yakin untuk menghapus data ini? Data yang sudah dihapus
            tidak dapat dikembalikan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row items-center justify-center gap-2 lg:justify-end">
          <Button
            variant="line"
            disabled={isSubmit}
            onClick={() => setIsOpen(false)}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isSubmit}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

DeletePackage.propTypes = {
  packageId: PropTypes.number.isRequired,
};
