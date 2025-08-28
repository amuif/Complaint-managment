'use client';
import { Sector } from '@/types/sector';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
// import EditSectorDialog from './sector-edit-dialog';
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
import { useOrganization } from '@/hooks/use-organization';
import { Subcities } from '@/types/subcities';
import { useSubcity } from '@/hooks/use-subcity';
import EditSubcityDialog from './edit-subcity';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import CreateSubcityDialog from './add-subcity';
// import CreateSectorDialog from './create-sector-dialog';

interface SectorTableProps {
  sectors: Sector[];
}
const SubcityTable = () => {
  const { Subcities } = useOrganization();
  const { deleteSubcity } = useSubcity();
  const [selectedSubcity, setSelectedSubcity] = useState<Subcities | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDialog, setIsOpenDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleEditClick = (subcity: Subcities) => {
    setSelectedSubcity(subcity);
    setDialogOpen(true);
  };
  const handleDeleteClick = (subcity: Subcities) => {
    setSelectedSubcity(subcity);
    setIsOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteSubcity(selectedSubcity?.id!);
      handleApiSuccess(response.message);
      setIsOpenDialog(false);
    } catch (error) {
      console.log('Error at updating subcity', error);
      handleApiError('Error at updating subcity');
    }
  };
  //
  useEffect(() => {
    console.log(Subcities);
  }, [Subcities]);

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <p className="font-bold text-lg lg:text-xl ">Subcities</p>
        <Button onClick={() => setShowCreateDialog(true)} className="" size="sm">
          <Plus />
          New Subcity
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Subcity Name</TableHead>
            <TableHead>Appointed Person</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Subcities.map((subcity, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{subcity.name_en}</TableCell>
              <TableCell>{subcity.appointed_person_en}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditClick(subcity)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(subcity)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditSubcityDialog subcity={selectedSubcity} open={dialogOpen} onOpenChange={setDialogOpen} />
      {showCreateDialog && (
        <CreateSubcityDialog open={showCreateDialog} setIsOpen={setShowCreateDialog} />
      )}
      {openDialog && (
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader className="flex-col space-y-4">
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete{' '}
                {selectedSubcity?.name_en} and remove sector data from our servers.
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

export default SubcityTable;
