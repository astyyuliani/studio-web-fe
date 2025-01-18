import * as React from "react";
import PropTypes from "prop-types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { timeService } from "@/services/time-service";
import { Alert, AlertDescription } from "../ui/alert";

export default function DeleteTimeSlot({ timeId }) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => timeService.deleteTime(timeId),
    onSuccess: (data) => {
      toast(data.message);
      queryClient.invalidateQueries("categories");
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
        <Button variant="destructive" size="icon">
          <Trash />
        </Button>
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
        <DialogFooter>
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

DeleteTimeSlot.propTypes = {
  timeId: PropTypes.number.isRequired,
};
