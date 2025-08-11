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
import EditSectorDialog from './sector-edit-dialog';
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
import CreateSectorDialog from './create-sector-dialog';

interface SectorTableProps {
  sectors: Sector[];
}
const SectorTable = ({ sectors }: SectorTableProps) => {
  const { deleteSector, getSectors } = useOrganization();
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDialog, setIsOpenDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleEditClick = (sector: Sector) => {
    setSelectedSector(sector);
    setDialogOpen(true);
  };
  const handleDeleteClick = (sector: Sector) => {
    setSelectedSector(sector);
    setIsOpenDialog(true);
  };

  const handleDelete = async () => {
    deleteSector(selectedSector?.id!);
    setIsOpenDialog(false);
    getSectors();
  };

  useEffect(() => {
    console.log(sectors);
  }, [sectors]);

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <p className="font-bold text-lg lg:text-xl ">Sectors</p>
        <Button onClick={() => setShowCreateDialog(true)} className="" size="sm">
          <Plus />
          New Sector
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Sector Name</TableHead>
            <TableHead>Appointed Person</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sectors.map((sector, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{sector.name_en}</TableCell>
              <TableCell>{sector.appointed_person_en}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditClick(sector)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(sector)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditSectorDialog sector={selectedSector} open={dialogOpen} onOpenChange={setDialogOpen} />
      {showCreateDialog && (
        <CreateSectorDialog open={showCreateDialog} setIsOpen={setShowCreateDialog} />
      )}
      {openDialog && (
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader className="flex-col space-y-4">
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete {selectedSector?.name_en}{' '}
                and remove sector data from our servers.
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

export default SectorTable;
