'use client';

import { useState, useEffect } from 'react';
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
import { Division } from '@/types/division';
import { handleApiSuccess } from '@/lib/error-handler';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface EditDirectorDialogProps {
  division: Division | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditDirectorDialog = ({ division, open, onOpenChange }: EditDirectorDialogProps) => {
  const { updateDirector, Sectors } = useOrganization();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    id: division?.id,
    name_en: '',
    name_af: '',
    name_am: '',
    office_number: '',
    profile_picture: division?.profile_picture,
    appointed_person_en: '',
    appointed_person_af: '',
    appointed_person_am: '',
    sector_id: division?.sector_id,
  });

  useEffect(() => {
    if (division) {
      setFormData(division);
    }
  }, [division]);

  const handleInputChange = (field: keyof Division, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append('id', String(formData.id));
    data.append('name_en', formData.name_en);
    data.append('name_af', formData.name_af);
    data.append('name_am', formData.name_am);
    data.append('office_number', formData.office_number);
    data.append('appointed_person_en', formData.appointed_person_en);
    data.append('appointed_person_af', formData.appointed_person_af);
    data.append('appointed_person_am', formData.appointed_person_am);

    if (formData.sector_id) {
      data.append('sector_id', formData.sector_id);
    }
    if (profilePictureFile) {
      data.append('profile_picture', profilePictureFile);
    }

    try {
      const response = await updateDirector(data);
      handleApiSuccess(response.message);
      onOpenChange(false);
    } catch (error) {
      console.error('Update failed', error);
    }
  };
  const handleCancel = () => {
    if (division) {
      setFormData(division);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Director</DialogTitle>
          <DialogDescription>
            Make changes to the director information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select
              value={formData.sector_id || ''}
              onValueChange={(value) => handleInputChange('sector_id', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Sector" />
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
            <Label htmlFor="name_en">Sector Name (English)</Label>
            <Input
              id="name_en"
              value={formData.name_en}
              onChange={(e) => handleInputChange('name_en', e.target.value)}
              placeholder="Enter English name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name_af">Sector Name (Afaan Oromoo)</Label>
            <Input
              id="name_af"
              value={formData.name_af}
              onChange={(e) => handleInputChange('name_af', e.target.value)}
              placeholder="Enter Afaan Oromoo name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name_am">Sector Name (Amharic)</Label>
            <Input
              id="name_am"
              value={formData.name_am}
              onChange={(e) => handleInputChange('name_am', e.target.value)}
              placeholder="Enter Amharic name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="office_number">Office Number and floor number</Label>
            <Input
              id="office_number"
              value={formData.office_number}
              onChange={(e) => handleInputChange('office_number', e.target.value)}
              placeholder="Enter your input here"
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
            placeholder={formData.profile_picture}
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
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDirectorDialog;
