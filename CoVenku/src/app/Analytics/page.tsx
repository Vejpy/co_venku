import AnalyticsClientWrapper from "@/components/analytic/AnalyticsClientWrapper";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnalyticsClientWrapper />
      </div>
    </div>
  );
}
