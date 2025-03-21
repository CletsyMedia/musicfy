const TabsListSkeleton = () => {
  return (
    <div className="p-1 bg-zinc-800/50 animate-pulse my-8">
      <div className="flex gap-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-zinc-700 rounded-md" />
        ))}
      </div>
    </div>
  );
};

export default TabsListSkeleton;
