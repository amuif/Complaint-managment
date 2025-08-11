import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Division } from '@/types/division';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { EllipsisVertical, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import EditSectorDialog from './sector-edit-dialog';
import EditDirectorDialog from './director-edit-dialog';
import { useOrganization } from '@/hooks/use-organization';
import { AddDirectorDialog } from './create-director-dialog';
import { handleApiSuccess } from '@/lib/error-handler';

interface DirectorTableProps {
  directors: Division[];
}
const DirectorTable = ({ directors }: DirectorTableProps) => {
  const { deleteDirector } = useOrganization();
  const [selectedDirector, setSelectedDirector] = useState<Division | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDialog, setIsOpenDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleDeleteClick = (division: Division) => {
    setSelectedDirector(division);
    setIsOpenDialog(true);
  };

  const handleEditClick = (division: Division) => {
    setSelectedDirector(division);
    setDialogOpen(true);
  };
  const handleDelete = async () => {
    const response = await deleteDirector(selectedDirector?.id!);
    handleApiSuccess(response.message);
    setIsOpenDialog(false);
  };
  useEffect(() => {
    console.log(directors);
  }, [directors]);

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <p className="font-bold text-lg lg:text-xl ">Directors</p>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus /> New Director
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Director </TableHead>
            <TableHead>Appointed Person</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directors.map((director, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{director.name_en}</TableCell>
              <TableCell>{director.appointed_person_en}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditClick(director)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(director)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditDirectorDialog
        division={selectedDirector}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      {showCreateDialog && (
        <AddDirectorDialog open={showCreateDialog} setIsOpen={setShowCreateDialog} />
      )}
      {openDialog && (
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader className="flex-col space-y-4">
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete{' '}
                {selectedDirector?.name_en} and remove sector data from our servers.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button onClick={() => setIsOpenDialog(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DirectorTable;
