'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
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
import { Subcities } from '@/types/subcities';
import { useSubcity } from '@/hooks/use-subcity';
interface AddSectorDialogProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateSubcityDialog = ({ open, setIsOpen }: AddSectorDialogProps) => {
  const { createSubcity } = useSubcity();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_af: '',
    name_am: '',
    appointed_person_en: '',
    appointed_person_af: '',
    appointed_person_am: '',
  });

  const handleInputChange = (field: keyof Subcities, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSave = async () => {
    const payload = {
      name_en: formData.name_en,
      name_af: formData.name_af,
      name_am: formData.name_am,
      appointed_person_en: formData.appointed_person_en,
      appointed_person_af: formData.appointed_person_af,
      appointed_person_am: formData.appointed_person_am,
    };
    console.log('payload', payload);

    try {
      const response = await createSubcity(payload);
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
      appointed_person_en: '',
      appointed_person_af: '',
      appointed_person_am: '',
    });
    setIsOpen(false);
  };

  return (
    open && (
      <div>
        <Dialog open={open} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Sector</DialogTitle>
              <DialogDescription>
                Add new sector's information and finally click create when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
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

export default CreateSubcityDialog;
