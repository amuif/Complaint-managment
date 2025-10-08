import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Department } from '@/types/department';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Plus } from 'lucide-react';
import { useOrganization } from '@/hooks/use-organization';
import { useEffect, useState } from 'react';
import EditTeamDialog from './team-edit-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CreateTeamDialog from './create-team-dialog';
import { handleApiSuccess } from '@/lib/error-handler';

interface TeamTableProps {
  teams: Department[];
}
const TeamTable = ({ teams }: TeamTableProps) => {
  const { deleteTeam } = useOrganization();
  const [selectedTeam, setSelectedTeam] = useState<Department | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDialog, setIsOpenDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const handleDeleteClick = (division: Department) => {
    setSelectedTeam(division);
    setIsOpenDialog(true);
  };

  const handleEditClick = (division: Department) => {
    setSelectedTeam(division);
    setDialogOpen(true);
  };
  const handleDelete = async () => {
    const response = await deleteTeam(selectedTeam?.id!);
    handleApiSuccess(response.message);
    setIsOpenDialog(false);
    window.location.reload();
  };
  useEffect(() => {
    console.log(teams);
  }, [teams]);

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <p className="font-bold text-lg lg:text-xl ">Teams </p>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus /> New Team
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>Appointed Person</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{team.name_en}</TableCell>
              <TableCell>{team.appointed_person_en}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditClick(team)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(team)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditTeamDialog team={selectedTeam} open={dialogOpen} onOpenChange={setDialogOpen} />
      {showCreateDialog && (
        <CreateTeamDialog open={showCreateDialog} setIsOpen={setShowCreateDialog} />
      )}
      {openDialog && (
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader className="flex-col space-y-4">
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete {selectedTeam?.name_en}{' '}
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

export default TeamTable;
