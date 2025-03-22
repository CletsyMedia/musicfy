import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { useMusicStore } from "@/stores/useMusicStore";
import { Album, Calendar, Music, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import LoadSpinner from "@/components/LoadSpinner";
import ErrorPage from "@/pages/404/ErrorPage";

const AlbumsTable = () => {
  const { albums, deletingAlbum, isLoading, fetchAlbums, searchTerm } =
    useMusicStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleDeleteClick = (albumId: string) => {
    setAlbumToDelete(albumId);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (albumToDelete) {
      try {
        await deletingAlbum(albumToDelete);
      } catch (error) {
        console.error("Failed to delete album", error);
      } finally {
        setIsDialogOpen(false);
        setAlbumToDelete(null);
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
    <div className="overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="hover:bg-zinc-800/50">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Release Year</TableHead>
            <TableHead>Songs</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAlbums.length > 0 ? (
            filteredAlbums.map((album) => (
              <TableRow key={album._id} className="hover:bg-zinc-800/50">
                <TableCell>
                  <img
                    src={album.imageUrl}
                    alt={album.title}
                    className="object-cover w-10 h-10 rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{album.title}</TableCell>
                <TableCell>{album.artist}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    {album.releaseYear}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <Music className="w-4 h-4" />
                    {album.songs.length} songs
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog open={isDialogOpen && albumToDelete === album._id}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/20"
                          onClick={() => handleDeleteClick(album._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-sm border-none rounded-md bg-zinc-900 border-zinc-700">
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the album.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-row items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsDialogOpen(false);
                              setAlbumToDelete(null);
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
              <TableCell colSpan={6} className="text-center text-gray-500">
                <ErrorPage
                  errorCode="404"
                  errorMessage="No Album Found"
                  customMessage="Looks like you were lost in the decks. Shuffle Again..."
                  icon={Album}
                  showButtons={[]}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default AlbumsTable;
