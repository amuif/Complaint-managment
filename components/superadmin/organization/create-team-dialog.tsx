'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Sector } from '@/types/sector';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrganization } from '@/hooks/use-organization';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Department } from '@/types/department';
interface AddSectorDialogProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateTeamDialog = ({ open, setIsOpen }: AddSectorDialogProps) => {
  const { createTeam, Sectors, Directors } = useOrganization();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_af: '',
    name_am: '',
    office_number: '',
    profile_picture: '',
    appointed_person_en: '',
    appointed_person_af: '',
    appointed_person_am: '',
    sector_id: '',
    division_id: '',
  });

  const handleInputChange = (field: keyof Department, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSave = async () => {
    const data = new FormData();
    data.append('name_en', formData.name_en);
    data.append('name_af', formData.name_af);
    data.append('name_am', formData.name_am);
    data.append('office_number', formData.office_number);
    data.append('appointed_person_en', formData.appointed_person_en);
    data.append('appointed_person_af', formData.appointed_person_af);
    data.append('appointed_person_am', formData.appointed_person_am);
    data.append('sector_id', formData.sector_id);
    data.append('division_id', formData.division_id);

    if (profilePictureFile) {
      data.append('profile_picture', profilePictureFile);
    }

    try {
      const response = await createTeam(data);
      console.log('response', response);
      handleApiSuccess(response.message);
      setIsOpen(false);
    } catch (error) {
      handleApiError(error);
      console.error('Update failed', error);
    }
  };
  const handleCancel = () => {
    setFormData({
      name_en: '',
      name_af: '',
      name_am: '',
      office_number: '',
      profile_picture: '',
      appointed_person_en: '',
      appointed_person_af: '',
      appointed_person_am: '',
      sector_id: '',
      division_id: '',
    });

    setIsOpen(false);
  };

  return (
    open && (
      <div>
        <Dialog open={open} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>
                Add new team information and finally click create when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Select
                  value={formData.sector_id}
                  onValueChange={(value) => handleInputChange('sector_id', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    {Sectors.map((sector, index) => (
                      <SelectItem key={index} value={sector.id}>
                        {sector.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Select
                  value={formData.division_id}
                  onValueChange={(value) => handleInputChange('division_id', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Directors" />
                  </SelectTrigger>
                  <SelectContent>
                    {Directors.map((division, index) => (
                      <SelectItem key={index} value={division.id}>
                        {division.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name_en">Team Name (English)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => handleInputChange('name_en', e.target.value)}
                  placeholder="Enter English name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name_af">Team Name (Afaan Oromoo)</Label>
                <Input
                  id="name_af"
                  value={formData.name_af}
                  onChange={(e) => handleInputChange('name_af', e.target.value)}
                  placeholder="Enter Afaan Oromoo name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name_am">Team Name (Amharic)</Label>
                <Input
                  id="name_am"
                  value={formData.name_am}
                  onChange={(e) => handleInputChange('name_am', e.target.value)}
                  placeholder="Enter Amharic name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="office_number">Office Number</Label>
                <Input
                  id="office_number"
                  value={formData.office_number}
                  onChange={(e) => handleInputChange('office_number', e.target.value)}
                  placeholder="Enter office number"
                />
              </div>

              <Label htmlFor="profile_picture">Profile Picture</Label>
              <Input
                id="profile_picture"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfilePictureFile(file);
                  }
                }}
              />
              <div className="grid gap-2">
                <Label htmlFor="appointed_person_en">Appointed Person (English)</Label>
                <Input
                  id="appointed_person_en"
                  value={formData.appointed_person_en}
                  onChange={(e) => handleInputChange('appointed_person_en', e.target.value)}
                  placeholder="Enter appointed person name in English"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="appointed_person_af">Appointed Person (Afaan Oromoo)</Label>
                <Input
                  id="appointed_person_af"
                  value={formData.appointed_person_af}
                  onChange={(e) => handleInputChange('appointed_person_af', e.target.value)}
                  placeholder="Enter appointed person name in Afaan Oromoo"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="appointed_person_am">Appointed Person (Amharic)</Label>
                <Input
                  id="appointed_person_am"
                  value={formData.appointed_person_am}
                  onChange={(e) => handleInputChange('appointed_person_am', e.target.value)}
                  placeholder="Enter appointed person name in Amharic"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  );
};

export default CreateTeamDialog;
