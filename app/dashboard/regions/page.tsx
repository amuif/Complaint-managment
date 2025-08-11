import { RegionsSidebar } from '@/components/regions-sidebar';

export default function RegionsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Regional Complaints Dashboard</h1>
      <div className="h-[calc(100vh-12rem)] rounded-lg border bg-card">
        <RegionsSidebar />
      </div>
    </div>
  );
}
