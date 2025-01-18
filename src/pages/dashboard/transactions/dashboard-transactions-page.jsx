import TransactionsTable from "@/components/table/transactions-table";

export default function DashboardTransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium lg:text-3xl">Transaksi</h1>
      <TransactionsTable />
    </div>
  );
}
