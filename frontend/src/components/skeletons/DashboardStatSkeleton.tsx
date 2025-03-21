import { Card, CardContent } from "@/components/ui/card";
const DashboardStatSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="bg-zinc-800/50 border-zinc-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="p-3 rounded-lg bg-zinc-700">
                <div className="size-6 bg-zinc-600 rounded-full" />
              </div>
              <div>
                <div className="h-4 w-20 bg-zinc-700 rounded mb-2" />
                <div className="h-6 w-12 bg-zinc-700 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatSkeleton;
