const NavbarSkeleton = () => {
  return (
    <div
      className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75
      backdrop-blur-md z-10"
    >
      <div className="flex gap-2 items-center">
        <div className="size-8 bg-zinc-700 rounded-full animate-pulse"></div>
        <div className="h-6 w-20 bg-zinc-700 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-10 w-32 bg-zinc-700 rounded animate-pulse"></div>

        <div className="size-10 bg-zinc-700 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};
export default NavbarSkeleton;
