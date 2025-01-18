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
import { categoryService } from "@/services/category-service";
import { toast } from "sonner";
import { Trash } from "lucide-react";

export default function DeleteCategory({ categoryId }) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmit, setIsSubmit] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => categoryService.deleteCategory(categoryId),
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
            className="m-0"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isSubmit}
            className="m-0"
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

DeleteCategory.propTypes = {
  categoryId: PropTypes.number.isRequired,
};
