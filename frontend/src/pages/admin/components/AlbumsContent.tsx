import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music } from "lucide-react";
import AlbumsTable from "./AlbumsTable";
import AddAlbumDialog from "./AddAlbumDialog";
import { Input } from "@/components/ui/input";
import { useMusicStore } from "@/stores/useMusicStore";

const AlbumContent = () => {
  const { searchTerm, setSearchTerm } = useMusicStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Card className="bg-zinc-800/40">
      <CardHeader className="bg-zinc-800 rounded-t-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Title and Description */}
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5 text-emerald-500" />
              Album Library
            </CardTitle>
            <CardDescription>Manage your album collections</CardDescription>
          </div>

          {/* Search Input and Add Album Button */}
          <div className="flex flex-row items-center gap-4">
            <Input
              type="text"
              placeholder="Search albums..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full text-white sm:w-48 md:w-64 bg-zinc-700 border-zinc-600 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <AddAlbumDialog />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <AlbumsTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default AlbumContent;
