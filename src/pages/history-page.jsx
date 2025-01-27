import HistoryTable from "@/components/table/history-table";

export default function HistoryPage() {
  return (
    <main className="mx-auto flex flex-col items-center justify-center">
      <div className="w-full max-w-[1440px] px-4 py-4 lg:px-20 lg:py-10">
        <HistoryTable />
      </div>
    </main>
  );
}
