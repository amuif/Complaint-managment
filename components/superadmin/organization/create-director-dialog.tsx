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
import { Division } from '@/types/division';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface AddDirectorDialogProps {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export const AddDirectorDialog = ({ open, setIsOpen }: AddDirectorDialogProps) => {
  const { createDirector, Sectors, Subcities } = useOrganization();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_af: '',
    name_am: '',
    profile_picture: '',
    appointed_person_en: '',
    appointed_person_af: '',
    appointed_person_am: '',
    sector_id: '',
    office_location_en: '',
    office_location_am: '',
    office_location_af: '',
    subcity_id: '',
  });

  const handleInputChange = (field: keyof Division, value: string | number) => {
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
    data.append('appointed_person_en', formData.appointed_person_en);
    data.append('appointed_person_af', formData.appointed_person_af);
    data.append('appointed_person_am', formData.appointed_person_am);
    data.append('sector_id', formData.sector_id);
    data.append('office_location_en', formData.office_location_en);
    data.append('office_location_am', formData.office_location_am);
    data.append('office_location_af', formData.office_location_af);
    data.append('subcity_id', formData.subcity_id)

    if (profilePictureFile) {
      data.append('profile_picture', profilePictureFile);
    }

    try {
      const response = await createDirector(data);
      handleApiSuccess(response.message);
      setIsOpen(false);
      window.location.reload();
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
      profile_picture: '',
      appointed_person_en: '',
      appointed_person_af: '',
      appointed_person_am: '',
      sector_id: '',
      office_location_en: '',
      office_location_am: '',
      office_location_af: '',
      subcity_id: '',
    });
    setIsOpen(false);
  };

  useEffect(() => {
    console.log(Sectors);
  });
  return (
    open && (
      <div>
        <Dialog open={open} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Director</DialogTitle>
              <DialogDescription>
                Add new director's information and finally click create when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Select
                  value={formData.subcity_id}
                  onValueChange={(value) => handleInputChange("subcity_id", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subcity" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {Subcities.map((subcity) => (
                        <SelectItem key={subcity.id} value={String(subcity.id)}>
                          {subcity.name_en}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

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
                <Label htmlFor="name_en">Director Name (English)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => handleInputChange('name_en', e.target.value)}
                  placeholder="Enter English name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name_af">Director Name (Afaan Oromoo)</Label>
                <Input
                  id="name_af"
                  value={formData.name_af}
                  onChange={(e) => handleInputChange('name_af', e.target.value)}
                  placeholder="Enter Afaan Oromoo name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name_am">Director Name (Amharic)</Label>
                <Input
                  id="name_am"
                  value={formData.name_am}
                  onChange={(e) => handleInputChange('name_am', e.target.value)}
                  placeholder="Enter Amharic name"
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
              <div className="grid gap-2">
                <Label htmlFor="office_location_en">Office Location (English)</Label>
                <Input
                  id="office_location_en"
                  value={formData.office_location_en}
                  onChange={(e) => handleInputChange('office_location_en', e.target.value)}
                  placeholder="Enter appointed person name in english"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="office_location_am">Office Location (Amharic)</Label>
                <Input
                  id="office_location_am"
                  value={formData.office_location_am}
                  onChange={(e) => handleInputChange('office_location_am', e.target.value)}
                  placeholder="Enter appointed person name in Amharic"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="office_location_af">Office Location (Oromoo)</Label>
                <Input
                  id="office_location_af"
                  value={formData.office_location_af}
                  onChange={(e) => handleInputChange('office_location_af', e.target.value)}
                  placeholder="Enter appointed person name in oromic"
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
      </div>
    )
  );
};
