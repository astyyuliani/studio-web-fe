import ReviewsTable from "@/components/table/reviews-table";

export default function DashboardReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium lg:text-3xl">Ulasan</h1>
      <ReviewsTable />
    </div>
  );
}
