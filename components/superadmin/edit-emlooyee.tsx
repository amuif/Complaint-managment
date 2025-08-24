'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Edit, Upload, Loader2, User, Briefcase, MapPin, GraduationCap } from 'lucide-react';
import type { Employee } from '@/types/employee';
import { useLanguage } from '@/components/language-provider';
import { toast } from 'sonner';
import { useEmployees } from '@/hooks/use-employees';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import { useOrganization } from '@/hooks/use-organization';
import { PICTURE_URL } from '@/constants/base_url';
import { Checkbox } from '../ui/checkbox';

interface EditEmployeeProps {
  employee: Employee;
  children: React.ReactNode;
}

export function EditEmployee({ employee, children }: EditEmployeeProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateEmployee } = useEmployees();
  const { Sectors, Directors, Teams } = useOrganization();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    id: employee.id,
    employee_id: employee.employee_id || '',
    // English fields
    first_name_en: employee.first_name_en || '',
    middle_name_en: employee.middle_name_en || '',
    last_name_en: employee.last_name_en || '',
    position_en: employee.position_en || '',
    bio_en: employee.bio_en || '',
    // Amharic fields
    first_name_am: employee.first_name_am || '',
    middle_name_am: employee.middle_name_am || '',
    last_name_am: employee.last_name_am || '',
    position_am: employee.position_am || '',
    bio_am: employee.bio_am || '',
    // Afaan Oromo fields
    first_name_af: employee.first_name_af || '',
    middle_name_af: employee.middle_name_af || '',
    last_name_af: employee.last_name_af || '',
    position_af: employee.position_af || '',
    bio_af: employee.bio_af || '',
    // Contact information
    email: employee.email || '',
    phone: employee.phone || '',
    // Location
    city: employee.city || '',
    subcity: employee.subcity || '',
    section: employee.section || '',
    office_number: employee.office_number || '',
    floor_number: employee.floor_number || 1,
    // Organizational structure
    office_id: employee.office_id,
    department_id: employee.department_id,
    team_id: employee.team_id,
    sector_id: employee.sector_id,
    division_id: employee.division_id,
    works_in_head_office: employee.works_in_head_office,

    // Professional information
    specializations: employee.specializations || '',
    years_of_service: employee.years_of_service || 0,
    education_level: employee.education_level || '',
    hire_date: employee.hire_date ? new Date(employee.hire_date).toISOString().split('T')[0] : '',
    is_active: employee.is_active ?? true,
    profile_picture: employee.profile_picture || null,
    created_at: employee.created_at,
    updated_at: employee.updated_at || '',
  });

  useEffect(() => {
    console.log(employee);
  }, [employee]);
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    const data = new FormData();

    for (const [key, value] of Object.entries(formData)) {
      if (value !== null && value !== undefined) {
        if (key === 'profile_picture' && value instanceof File) {
          data.append(key, value);
        } else {
          data.append(key, value.toString());
        }
      }
    }

    try {
      const response = await updateEmployee(data);
      handleApiSuccess(response.message);
      setOpen(false);
    } catch (error) {
      handleApiError('Failed to update employee');
    } finally {
      setIsLoading(false);
    }
  };

  const employeeName =
    `${employee.first_name_en} ${employee.middle_name_en || ''} ${employee.last_name_en}`.trim();

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_picture: file,
      }));
      setProfilePictureFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {t('editEmployee') || 'Edit Employee'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('personal') || 'Personal'}
            </TabsTrigger>
            <TabsTrigger value="work" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {t('work') || 'Work'}
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t('location') || 'Location'}
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              {t('professional') || 'Professional'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    profilePictureFile
                      ? URL.createObjectURL(profilePictureFile)
                      : `${PICTURE_URL}${formData.profile_picture}` ||
                        '/placeholder.svg?height=80&width=80'
                  }
                  alt={employeeName}
                />
                <AvatarFallback className="text-lg">
                  {employee.first_name_en?.charAt(0) || 'E'}
                  {employee.middle_name_en?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button variant="outline" size="sm" onClick={handleButtonClick}>
                  <Upload className="h-4 w-4 mr-2" />
                  {t('changePhoto') || 'Change Photo'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Name in Different Languages</h3>

              {/* English Names */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-600">English</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name_en">First Name</Label>
                    <Input
                      id="first_name_en"
                      value={formData.first_name_en}
                      onChange={(e) => handleInputChange('first_name_en', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middle_name_en">Middle Name</Label>
                    <Input
                      id="middle_name_en"
                      value={formData.middle_name_en}
                      onChange={(e) => handleInputChange('middle_name_en', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name_en">Last Name</Label>
                    <Input
                      id="last_name_en"
                      value={formData.last_name_en}
                      onChange={(e) => handleInputChange('last_name_en', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Amharic Names */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-green-600">አማርኛ (Amharic)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name_am">የመጀመሪያ ስም</Label>
                    <Input
                      id="first_name_am"
                      value={formData.first_name_am}
                      onChange={(e) => handleInputChange('first_name_am', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middle_name_am">የአባት ስም</Label>
                    <Input
                      id="middle_name_am"
                      value={formData.middle_name_am}
                      onChange={(e) => handleInputChange('middle_name_am', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name_am">የአያት ስም</Label>
                    <Input
                      id="last_name_am"
                      value={formData.last_name_am}
                      onChange={(e) => handleInputChange('last_name_am', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Afaan Oromo Names */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-orange-600">Afaan Oromo</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name_af">Maqaa Jalqabaa</Label>
                    <Input
                      id="first_name_af"
                      value={formData.first_name_af}
                      onChange={(e) => handleInputChange('first_name_af', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middle_name_af">Maqaa Abbaa</Label>
                    <Input
                      id="middle_name_af"
                      value={formData.middle_name_af}
                      onChange={(e) => handleInputChange('middle_name_af', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name_af">Maqaa Akaakayyuu</Label>
                    <Input
                      id="last_name_af"
                      value={formData.last_name_af}
                      onChange={(e) => handleInputChange('last_name_af', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email!}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone!}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="work" className="space-y-6">
            {/* Position in Multiple Languages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Position</h3>

              <div className="space-y-2">
                <Label htmlFor="position_en">Position (English)</Label>
                <Input
                  id="position_en"
                  value={formData.position_en}
                  onChange={(e) => handleInputChange('position_en', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position_am">ሃላፊነት (አማርኛ)</Label>
                <Input
                  id="position_am"
                  value={formData.position_am}
                  onChange={(e) => handleInputChange('position_am', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position_af">Aangoo (Afaan Oromo)</Label>
                <Input
                  id="position_af"
                  value={formData.position_af}
                  onChange={(e) => handleInputChange('position_af', e.target.value)}
                />
              </div>
            </div>

            {/* Organizational Structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector_id">Sector</Label>
                <Select
                  value={formData.sector_id?.toString()}
                  onValueChange={(value) => handleInputChange('sector_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {Sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id.toString()}>
                        {sector.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department_id">Director</Label>
                <Select
                  value={formData.department_id?.toString()}
                  onValueChange={(value) => handleInputChange('department_id', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={'Select Team'} />
                  </SelectTrigger>
                  <SelectContent>
                    {Directors.map((director) => (
                      <SelectItem key={director.id} value={director.id.toString()}>
                        {director.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team_id">Team</Label>
                <Select
                  value={formData.team_id?.toString()}
                  onValueChange={(value) => handleInputChange('team_id', parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('selectTeam') || 'Select Team'} />
                  </SelectTrigger>
                  <SelectContent>
                    {Teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="works_in_head_office"
                checked={formData.works_in_head_office}
                onCheckedChange={(checked) => handleInputChange('works_in_head_office', checked)}
              />
              <Label htmlFor="works_in_head_office">Works in main office?</Label>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t('city') || 'City'}</Label>
                <Input
                  id="city"
                  value={formData.city!}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcity">{t('subcity') || 'Subcity'}</Label>
                <Input
                  id="subcity"
                  value={formData.subcity?.id!}
                  onChange={(e) => handleInputChange('subcity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="office_number">{t('officeNumber') || 'Office Number'}</Label>
                <Input
                  id="office_number"
                  value={formData.office_number!}
                  onChange={(e) => handleInputChange('office_number', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor_number">{t('floorNumber') || 'Floor Number'}</Label>
                <Input
                  id="floor_number"
                  type="number"
                  value={formData.floor_number!}
                  onChange={(e) => handleInputChange('floor_number', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education_level">{t('educationLevel') || 'Education Level'}</Label>
                <Input
                  id="education_level"
                  value={formData.education_level!}
                  onChange={(e) => handleInputChange('education_level', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_of_service">
                  {t('yearsOfService') || 'Years of Service'}
                </Label>
                <Input
                  id="years_of_service"
                  type="number"
                  value={formData.years_of_service}
                  onChange={(e) =>
                    handleInputChange('years_of_service', parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire_date">{t('hireDate') || 'Hire Date'}</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={formData.hire_date!}
                  onChange={(e) => handleInputChange('hire_date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specializations">{t('specializations') || 'Specializations'}</Label>
              <Textarea
                id="specializations"
                value={formData.specializations!}
                onChange={(e) => handleInputChange('specializations', e.target.value)}
                placeholder="e.g., Networking, Cybersecurity, Database Management"
              />
            </div>

            {/* Bio in Multiple Languages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('biography') || 'Biography'}</h3>

              <div className="space-y-2">
                <Label htmlFor="bio_en">Bio (English)</Label>
                <Textarea
                  id="bio_en"
                  value={formData.bio_en!}
                  onChange={(e) => handleInputChange('bio_en', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio_am">መግለጫ (አማርኛ)</Label>
                <Textarea
                  id="bio_am"
                  value={formData.bio_am!}
                  onChange={(e) => handleInputChange('bio_am', e.target.value)}
                  rows={3}
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio_af">Hiikkaa (Afaan Oromo)</Label>
                <Textarea
                  id="bio_af"
                  value={formData.bio_af!}
                  onChange={(e) => handleInputChange('bio_af', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t('saveChanges') || 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
