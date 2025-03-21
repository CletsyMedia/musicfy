const HeaderSkeleton = () => {
  return (
    <div className="flex items-start justify-between animate-pulse my-6">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 bg-zinc-800 rounded-lg mt-1" />
        <div>
          <div className="h-8 w-48 bg-zinc-800 rounded mb-2" />
          <div className="h-4 w-32 bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="h-10 w-10 bg-zinc-800 rounded-full" />
    </div>
  );
};

export default HeaderSkeleton;
