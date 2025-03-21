import { useState } from "react";
import LoadSpinner from "@/components/LoadSpinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ErrorPage from "@/pages/404/ErrorPage";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2, Music2 } from "lucide-react";

const SongsTable = () => {
  const { songs, isLoading, deletingSong, searchTerm } = useMusicStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<string | null>(null);

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (songId: string) => {
    setSongToDelete(songId);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (songToDelete) {
      try {
        await deletingSong(songToDelete);
      } catch (error) {
        console.error("Failed to delete song", error);
      } finally {
        setIsDialogOpen(false);
        setSongToDelete(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadSpinner />
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-zinc-800/50">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <TableRow key={song._id} className="hover:bg-zinc-800/50">
                <TableCell>
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="size-6 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{song.title}</TableCell>
                <TableCell className="font-medium">{song.artist}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <Calendar className="size-4" />
                    {song.createdAt.split("T")[0]}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end ">
                    <Dialog open={isDialogOpen && songToDelete === song._id}>
                      <DialogTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/20"
                          onClick={() => handleDeleteClick(song._id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-700">
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the song.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsDialogOpen(false);
                              setSongToDelete(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                <ErrorPage
                  errorCode="404"
                  errorMessage="No Songs Found"
                  customMessage="Looks like you were lost in the shuffle. Search Again..."
                  icon={Music2}
                  showButtons={[]}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default SongsTable;
