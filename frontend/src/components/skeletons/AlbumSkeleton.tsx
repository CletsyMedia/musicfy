import { ScrollArea } from "@/components/ui/scroll-area";

export const AlbumPageSkeleton = () => {
  return (
    <div className="h-full w-full">
      <ScrollArea className="h-full rounded-md bg-zinc-800/40">
        <div className="relative min-h-full">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="h-full bg-zinc-800/40 animate-pulse" />
          </div>

          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <div className="w-[240px] h-[240px] bg-zinc-800/40 rounded animate-pulse" />
              <div className="flex flex-col justify-end gap-2 flex-1">
                <div className="h-4 w-20 bg-zinc-800/40 rounded animate-pulse" />
                <div className="h-12 w-64 bg-zinc-800/40 rounded animate-pulse my-4" />
                <div className="h-4 w-48 bg-zinc-800/40 rounded animate-pulse" />
              </div>
            </div>

            {/* Playback Controls Skeleton */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <div className="w-12 h-12 bg-zinc-800/40 rounded-full animate-pulse" />
              <div className="w-14 h-14 bg-zinc-800/40 rounded-full animate-pulse" />
              <div className="w-12 h-12 bg-zinc-800/40 rounded-full animate-pulse" />
            </div>

            {/* Waveform Skeleton */}
            <div className="w-full h-24 mb-4 bg-zinc-800/40 rounded animate-pulse" />

            {/* Songs List Skeleton */}
            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <div className="h-4 w-4 bg-zinc-800/40 rounded animate-pulse" />
                </div>
              </div>

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                    >
                      <div className="h-4 w-4 bg-zinc-800/40 rounded animate-pulse" />
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-zinc-800/40 rounded animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 w-32 bg-zinc-800/40 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-zinc-800/40 rounded animate-pulse mt-1" />
                        </div>
                      </div>
                      <div className="h-4 w-20 bg-zinc-800/40 rounded animate-pulse" />
                      <div className="h-4 w-12 bg-zinc-800/40 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
