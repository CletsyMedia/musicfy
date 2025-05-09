import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music } from "lucide-react";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";
import { Input } from "@/components/ui/input";
import { useMusicStore } from "@/stores/useMusicStore";

const SongsTabContent = () => {
  const { searchTerm, setSearchTerm } = useMusicStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Card className="bg-zinc-800/40">
      <CardHeader className="bg-zinc-800 rounded-t-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5 text-emerald-500" />
              Songs Library
            </CardTitle>
            <CardDescription>Manage your musicfy tracks</CardDescription>
          </div>

          <div className="flex flex-row items-center gap-4">
            <Input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full text-white sm:w-48 md:w-64 bg-zinc-700 border-zinc-600 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <AddSongDialog />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <SongsTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default SongsTabContent;
