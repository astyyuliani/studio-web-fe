import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loading from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  cn,
  dateFormat,
  dateTimeFormat,
  rupiahFormat,
  timeFormat,
} from "@/lib/utils";
import { transactionService } from "@/services/transaction-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DialogClose } from "@radix-ui/react-dialog";
import { Check, Cross } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function TransactionsDetailPage() {
  const { transactionId } = useParams();
  const queryClient = useQueryClient();

  const [isValidDialogOpen, setIsValidDialogOpen] = useState(null);
  const [isInvalidDialogOpen, setIsInvalidDialogOpen] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: transaction,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => transactionService.getTransaction(transactionId),
    queryKey: ["transaction", transactionId],
    enabled: !!transactionId,
  });

  const setValidMutation = useMutation({
    mutationFn: async ({ id, detailId }) =>
      await transactionService.setValid(id, detailId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["transactions", transactionId]);
      toast(data.message);
      setIsValidDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const setInvalidMutation = useMutation({
    mutationFn: async ({ id, detailId }) =>
      await transactionService.setInValid(id, detailId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["transactions", transactionId]);
      toast(data.message);
      setIsInvalidDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const setPaid = useMutation({
    mutationFn: async (id) => await transactionService.setPaid(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["transactions", transactionId]);
      toast(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div className="text-center text-red-500">{error.message}</div>;
  }

  if (!transaction || !transaction.data) {
    return <div className="text-center">Transaction not found</div>;
  }

  const paid = () => {
    if (transaction.data.status === "paid") return false;
    const validDetails = transaction.data.transaction_detail.filter(
      (detail) => detail.isValid === "true",
    );
    if (transaction.data.type === "fullpayment") {
      return validDetails.length === 1;
    } else if (transaction.data.type === "downpayment") {
      return validDetails.length === 2;
    }
    return false;
  };

  const handleValid = async (detailId) => {
    setIsProcessing(true);
    try {
      await setValidMutation.mutateAsync({ id: transactionId, detailId });
      setIsValidDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInvalid = async (detailId) => {
    setIsProcessing(true);
    try {
      await setInvalidMutation.mutateAsync({ id: transactionId, detailId });
      setIsInvalidDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaid = async () => {
    setIsProcessing(true);
    try {
      await setPaid.mutateAsync(transactionId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const trxType =
    transaction.data.type === "fullpayment" ? "Lunas" : "DP 50%";
  const fullPayment = transaction.data.type === "fullpayment";
  const dpPayment = transaction.data.type === "downpayment";
  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/dashboard/transactions"
        className={cn(buttonVariants(), "max-w-max font-bold")}
      >
        Kembali
      </Link>
      <h1 className="text-lg font-medium lg:text-3xl">Detail Transaksi</h1>
      <div className="flex flex-col gap-2 lg:w-3/4">
        <div className="grid grid-cols-2">
          <p>Metode Pelunasan</p>
          <Badge
            className={cn(
              fullPayment && "bg-sky-500",
              dpPayment && "bg-teal-500",
              "max-w-max px-2 py-1 rounded-full text-white text-sm w-fit",
            )}
          >
            {trxType}
          </Badge>
        </div>
        <div className="mt-4 grid grid-cols-2">
          <p>ID Reservasi</p>
          <p>{transaction.data.reservation.id}</p>
        </div>
        <div className="grid grid-cols-2">
          <p>Tanggal</p>
          <p>{dateFormat(transaction.data.reservation.date)}</p>
        </div>
        <div className="grid grid-cols-2">
          <p>Waktu</p>
          <p>{timeFormat(transaction.data.reservation.timeSlot.time)}</p>
        </div>
        <div className="grid grid-cols-2">
          <p>Kategori</p>
          <p>{transaction.data.reservation.category.name}</p>
        </div>
        <div className="mt-4 space-y-2">
          <p>Paket</p>
          <div className="grid grid-cols-2">
            <p>{transaction.data.reservation.categoryPackage.name}</p>
            <p>
              {rupiahFormat(transaction.data.reservation.categoryPackage.price)}
            </p>
          </div>
        </div>
        {transaction.data.reservation.reservation_detail.length > 0 && (
          <div className="mt-4 space-y-2">
            <p>Tambahan</p>
            {transaction.data.reservation.reservation_detail.map((addon) => (
              <div className="grid grid-cols-2" key={addon.id}>
                <p>
                  {addon.categoryAddon.name} x{addon.quantity}
                </p>
                <p>
                  {rupiahFormat(addon.categoryAddon.price * addon.quantity)}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2">
          <p>Total</p>
          <p>{rupiahFormat(transaction.data.reservation.total)}</p>
        </div>
      </div>
      {paid() && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Selesaikan Transaksi</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Transaksi Selesai</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin transaksi ini telah selesai? Tindakan ini
                tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row items-center justify-center gap-2 lg:justify-end">
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button onClick={() => handlePaid()} isLoading={isProcessing}>
                Ya, Tandai Lunas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {transaction.data.status === "paid" && (
        <Alert
          variant="default"
          className="border-2 border-green-500 bg-green-200/10 text-green-500"
        >
          <AlertTitle className="m-0">Transaksi Selesai</AlertTitle>
        </Alert>
      )}
      {transaction.data.status === "expired" && (
        <Alert variant="destructive" className="border-2">
          <AlertTitle className="m-0">Transaksi Kadaluarsa</AlertTitle>
        </Alert>
      )}
      {transaction.data.status !== "expired" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Total</TableHead>
              <TableHead className="text-center lg:text-left">Status Verifikasi</TableHead>
              <TableHead>Bukti</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transaction.data.transaction_detail.map((detail) => {
              const status =
                detail.isValid === "true"
                  ? "Valid"
                  : detail.isValid === "false"
                    ? "Tidak Valid"
                    : "Menunggu";

              const valid = detail.isValid === "true";
              const inValid = detail.isValid === "false";
              return (
                <TableRow key={detail.id}>
                  <TableCell>{rupiahFormat(detail.total)}</TableCell>
                  <TableCell className="text-center lg:text-left">
                    <Badge
                      className={cn(
                        "bg-sky-600",
                        valid && "bg-green-500",
                        inValid && "bg-destructive",
                        "text-center lg:text-left px-2 py-1 rounded-full text-white text-sm w-fit",
                      )}
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog className="max-w-2xl">
                      <DialogTrigger asChild>
                        <Button size="sm">Lihat Bukti</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Bukti Pembayaran</DialogTitle>
                          <DialogDescription className="hidden"></DialogDescription>
                        </DialogHeader>
                        <img
                          src={detail.images[0].imageUrl}
                          alt="Bukti Pembayaran"
                        />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{dateTimeFormat(detail.createdAt)}</TableCell>
                  <TableCell className="flex flex-col items-center justify-center gap-2 lg:flex-row">
                    {detail.isValid !== "true" &&
                      detail.isValid !== "false" && (
                        <>
                          <Dialog
                            open={isValidDialogOpen === detail.id}
                            onOpenChange={(isOpen) =>
                              isOpen
                                ? setIsValidDialogOpen(detail.id)
                                : setIsValidDialogOpen(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" className="bg-green-500 hover:bg-green-400 text-white">
                                <Check size={20} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Apakah anda yakin?</DialogTitle>
                                <DialogDescription>
                                  Apakah anda yakin ingin memvalidasi pembayaran
                                  ini? Pembayaran ini akan dianggap valid dan
                                  tidak dapat diubah lagi.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="flex flex-row items-center justify-center gap-2 lg:justify-end">
                                <DialogClose asChild>
                                  <Button variant="outline">Batal</Button>
                                </DialogClose>
                                <Button
                                  onClick={() => handleValid(detail.id)}
                                  isLoading={isProcessing}
                                >
                                  Ya
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Dialog
                            open={isInvalidDialogOpen === detail.id}
                            onOpenChange={(isOpen) =>
                              isOpen
                                ? setIsInvalidDialogOpen(detail.id)
                                : setIsInvalidDialogOpen(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Cross1Icon />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Apakah anda yakin?</DialogTitle>
                                <DialogDescription>
                                  Apakah anda yakin ingin menandai pembayaran
                                  ini sebagai tidak valid? Pembayaran ini akan
                                  dianggap tidak valid dan tidak dapat diubah
                                  lagi.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="flex flex-row items-center justify-center gap-2 lg:justify-end">
                                <DialogClose asChild>
                                  <Button variant="outline">Batal</Button>
                                </DialogClose>
                                <Button
                                  onClick={() => handleInvalid(detail.id)}
                                  isLoading={isProcessing}
                                >
                                  Ya
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
