import PropTypes from "prop-types";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationService } from "@/services/reservation-service";
import { toast } from "sonner";
import { useState } from "react";
import { Check } from "lucide-react";

export default function SetReservationSuccess({ id }) {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const setSuccessMutation = useMutation({
    mutationFn: () => reservationService.setSuccess(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries("reservations");
      toast(data.message);
      setIsProcessing(false);
    },
    onError: (error) => {
      toast(error.message);
      console.error(error.message);
      setIsProcessing(false);
    },
  });

  const handleSetSuccess = async () => {
    setIsProcessing(true);
    try {
      await setSuccessMutation.mutateAsync();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="bg-primary w-9 h-9 flex items-center justify-center text-white rounded-sm hover:bg-primary/70 ease-out duration-100">
          <Check size={20} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apakah anda yakin?</DialogTitle>
          <DialogDescription>
            Reservasi akan ditandai sebagai selesai. Tindakan ini tidak dapat
            diurungkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row items-center justify-center gap-2 lg:justify-end">
          <DialogClose asChild>
            <Button variant="outline">Tidak</Button>
          </DialogClose>
          <Button onClick={handleSetSuccess} isLoading={isProcessing}>
            Ya
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

SetReservationSuccess.propTypes = {
  id: PropTypes.number.isRequired,
};
