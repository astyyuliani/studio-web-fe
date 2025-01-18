import { Spinner } from "@/components/icons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  cn,
  dateFormat,
  dateTimeFormat,
  rupiahFormat,
  timeFormat,
} from "@/lib/utils";
import { reservationService } from "@/services/reservation-service";
import { transactionService } from "@/services/transaction-service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PaymentForm from "@/components/form/payment/payment-form";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentPage() {
  const { transactionId } = useParams();

  const {
    data: transaction,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
    error: transactionError,
  } = useQuery({
    queryFn: () => transactionService.getTransaction(transactionId),
    queryKey: ["transaction", transactionId],
  });

  const {
    data: reservation,
    isLoading: isReservationLoading,
    isError: isReservationError,
    error: reservationError,
  } = useQuery({
    queryFn: () =>
      reservationService.getReservation(transaction?.data?.reservation?.id),
    queryKey: ["reservation", transaction?.data?.reservation?.id],
    enabled: !!transaction?.data?.reservation?.id,
  });

  if (isTransactionLoading || isReservationLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isTransactionError || isReservationError) {
    return (
      <main className="mx-auto flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-[1440px] px-20 py-10">
          <Alert
            variant="destructive"
            className="border-2 border-destructive bg-destructive-foreground"
          >
            <AlertDescription className="font-medium">
              {transactionError?.message ||
                reservationError?.message ||
                "Terjadi kesalahan pada server. Coba lagi nanti."}
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  if (!transaction || !reservation) {
    return (
      <main className="mx-auto flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-[1440px] px-20 py-10">
          <Alert
            variant="destructive"
            className="border-2 border-destructive bg-destructive-foreground"
          >
            <AlertDescription className="font-medium">
              Data tidak ditemukan
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-xl space-y-6 px-4 py-4 lg:py-10">
        <Link
          to="/history"
          className={cn(buttonVariants(), "max-w-max font-bold")}
        >
          Kembali
        </Link>
        <Card>
          <CardHeader className="space-y-6">
            <CardTitle>{reservation.data.category.name}</CardTitle>
            {transaction.data.expiredAt && (
              <Alert
                variant="primary"
                className="border-2 border-primary bg-primary-foreground"
              >
                <AlertDescription className="font-medium text-primary text-center">
                  Batas pembayaran :{" "}
                  {dateFormat(reservation.data.date)} pukul {timeFormat(reservation.data.timeSlot.time)}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex flex-row justify-between">
                <p>Tanggal</p>
                <p>{dateFormat(reservation.data.date)}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Waktu</p>
                <p>{timeFormat(reservation.data.timeSlot.time)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <p>{reservation.data.categoryPackage.name}</p>
                <p>{rupiahFormat(reservation.data.categoryPackage.price)}</p>
              </div>
              {reservation.data.reservation_detail && (
                <div className="flex flex-col gap-2">
                  {reservation.data.reservation_detail.map((addon) => (
                    <div
                      className="flex flex-row justify-between"
                      key={addon.id}
                    >
                      <p>
                        {addon.categoryAddon.name} x{addon.quantity}
                      </p>
                      <p>
                        {rupiahFormat(
                          addon.categoryAddon.price * addon.quantity,
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-row justify-between pt-6">
                <p>Total</p>
                <p>
                  {rupiahFormat(
                    transaction.data.type === "downpayment"
                      ? transaction.data.total * 2
                      : transaction.data.total,
                  )}
                </p>
              </div>
              {transaction.data.type === "downpayment" && (
                <div className="flex flex-row justify-between">
                  <p>Yang harus dibayarkan (2x)</p>
                  <p>{rupiahFormat(transaction.data.total)}</p>
                </div>
              )}
              <div className="flex flex-row justify-between">
                <p>Metode Pelunasan</p>
                <p>
                  {transaction.data.type === "fullpayment"
                    ? "Lunas"
                    : "DP 50%"}
                </p>
              </div>
            </div>
          </CardHeader>
          {transaction.data.status === "paid" ? (
            <CardContent>
              <Alert className="border-2 border-green-500 bg-green-200/10">
                <AlertDescription className="text-center font-medium text-green-500">
                  Pembayaran telah diterima
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : transaction.data.status === "expired" ? (
            <CardContent>
              <Alert
                variant="destructive"
                className="border-2 border-destructive bg-destructive-foreground"
              >
                <AlertDescription className="font-medium">
                  Pembayaran kadaluarsa
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : reservation.data.status === "cancelled" ? (
            <CardContent>
              <Alert
                variant="destructive"
                className="border-2 border-destructive bg-destructive-foreground"
              >
                <AlertDescription className="font-medium">
                  Reservasi telah dibatalkan
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : (
            <>
              <CardContent className="space-y-4 border-y p-4">
                <img src="/qris-example.jpg" alt="qris"></img>
              </CardContent>
              <CardFooter className="flex justify-between">
              {transaction.data.transaction_detail.length > 0 &&
                transaction.data.transaction_detail.some(v => v['isValid'] === false || v['isValid'] === null) ? (
                  <Alert
                    variant="primary"
                    className="border-2 border-primary bg-primary-foreground mt-6"
                  >
                    <AlertDescription className="font-medium text-primary text-center">
                      Batas pembayaran :{" "}
                      {dateFormat(reservation.data.date)} pukul {timeFormat(reservation.data.timeSlot.time)}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <PaymentForm />
                )}

              </CardFooter>
            </>
          )}
        </Card>
        {transaction.data.transaction_detail.length > 0 && (
          <>
            <div className="space-y-4">Rincian Pembayaran</div>
            <Table>
              <TableBody>
                {transaction.data.transaction_detail.map((detail) => {
                  const status =
                    detail.isValid === "true"
                      ? "Valid"
                      : detail.isValid === "false"
                        ? "Tidak Valid"
                        : "Sedang diproses";

                  const valid = detail.isValid === "true";
                  const inValid = detail.isValid === "false";

                  return (
                    <TableRow key={detail.id}>
                      <TableCell>{dateTimeFormat(detail.createdAt)}</TableCell>
                      <TableCell>{rupiahFormat(detail.total)}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "bg-sky-600",
                            valid && "bg-green-500",
                            inValid && "bg-destructive",
                            "px-2 py-1 text-md"
                          )}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </main>
  );
}
