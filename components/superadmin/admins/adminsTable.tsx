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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Plus } from 'lucide-react';
import { User } from '@/types/user';
import { UserEditDialog } from './admin-edit-dialog';
import { UserCreateDialog } from './admin-create-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PICTURE_URL } from '@/constants/base_url';

interface AdminTableProps {
  admins: User[];
}
const AdminTable = ({ admins }: AdminTableProps) => {
  const { deleteAdmin } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDialog, setIsOpenDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsOpenDialog(true);
  };
  const handleDelete = async () => {
    if (selectedUser) {
      try {
        const response = await deleteAdmin(selectedUser.id.toString());
        handleApiSuccess(response.message);
        setIsOpenDialog(false);
      } catch (error) {
        console.error(error);
        handleApiError('Failed to delete admin');
      }
    }
  };

  useEffect(() => {
    console.log(admins);
  }, [admins]);

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <p className="font-bold text-lg lg:text-xl ">Admins</p>
        <Button onClick={() => setShowCreateDialog(true)} className="" size="sm">
          <Plus />
          New Admin
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Admin Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="flex gap-2 items-center ">
                <Avatar>
                  <AvatarImage src={`${PICTURE_URL}${admin.profile_picture}`} />
                  <AvatarFallback>{admin.first_name[0] + admin.last_name[0]}</AvatarFallback>
                </Avatar>{' '}
                {admin.first_name + ' ' + admin.last_name}
              </TableCell>
              <TableCell>{admin.role}</TableCell>
              <TableCell>{admin.phone || 'unassigned'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditClick(admin)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(admin)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserEditDialog user={selectedUser} open={dialogOpen} onOpenChange={setDialogOpen} />
      {showCreateDialog && (
        <UserCreateDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      )}

      {openDialog && (
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader className="flex-col space-y-4">
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete{' '}
                {selectedUser?.first_name + ' ' + selectedUser?.last_name} and remove all of the
                data from our servers.
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

export default AdminTable;
