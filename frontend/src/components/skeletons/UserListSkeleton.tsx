const UsersListSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="flex items-center justify-center gap-3 p-3 rounded-lg lg:justify-start animate-pulse"
    >
      <div className="rounded-full size-6 sm:size-8 md:size-12 bg-zinc-800" />
      <div className="flex-1 hidden lg:block">
        <div className="w-24 h-4 mb-2 rounded bg-zinc-800" />
        <div className="w-32 h-3 rounded bg-zinc-800" />
      </div>
    </div>
  ));
};
export default UsersListSkeleton;
