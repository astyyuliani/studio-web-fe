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
import { addonsService } from "@/services/addons-service";
import { Delete, Trash } from "lucide-react";

export default function DeleteAddon({ addonId }) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => addonsService.deleteAddon(addonId),
    onSuccess: (data) => {
      toast(data.message);
      queryClient.invalidateQueries("addons");
      setIsSubmit(false);
    },
    onError: (error) => {
      setErrorMsg(error.message);
      setIsSubmit(false);
    },
  });

  async function handleDelete() {
    setIsSubmit(true);
    setErrorMsg("");

    try {
      await deleteMutation.mutateAsync();
      setIsOpen(false);
    } catch (error) {
      setErrorMsg(error.message);
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
          {errorMsg && (
            <Alert variant="error">
              <AlertDescription>{errorMsg}</AlertDescription>
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
            variant="outline"
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

DeleteAddon.propTypes = {
  addonId: PropTypes.number.isRequired,
};
