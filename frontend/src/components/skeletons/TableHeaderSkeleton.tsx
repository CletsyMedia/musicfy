import { Card, CardContent, CardHeader } from "@/components/ui/card";

const TableHeaderSkeleton = () => {
  return (
    <Card className="bg-zinc-800/40 animate-pulse">
      <CardHeader className="bg-zinc-800 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-48 bg-zinc-700 rounded mb-2" />
            <div className="h-4 w-64 bg-zinc-700 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-64 bg-zinc-700 rounded" />
            <div className="h-10 w-24 bg-zinc-700 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-zinc-700 rounded" />
      </CardContent>
    </Card>
  );
};

export default TableHeaderSkeleton;
