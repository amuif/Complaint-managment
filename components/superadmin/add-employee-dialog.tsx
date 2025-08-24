'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/language-provider';
import { toast } from 'sonner';
import { useEmployees } from '@/hooks/use-employees';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import { useOrganization } from '@/hooks/use-organization';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sector } from '@/types/sector';
import { Division } from '@/types/division';
import { Checkbox } from '../ui/checkbox';
import { useAuthStore } from '@/lib/auth-store';

interface AddEmployeeDialogProps {
  onSuccess?: () => void;
}

const employeeSchema = z.object({
  first_name_en: z.string().min(1, 'First name (English) is required'),
  first_name_am: z.string().optional(),
  first_name_af: z.string().optional(),
  middle_name_en: z.string().min(1, 'Middle name (English) is required'),
  middle_name_am: z.string().optional(),
  middle_name_af: z.string().optional(),
  last_name_en: z.string().optional(),
  last_name_am: z.string().optional(),
  last_name_af: z.string().optional(),
  position_en: z.string().min(1, 'Position (English) is required'),
  position_am: z.string().optional(),
  position_af: z.string().optional(),
  section: z.string().optional(),
  city: z.string().optional(),
  works_in_head_office: z.boolean().default(false).optional(),
  sector_id: z.string().min(1, 'Sector is required'),
  department_id: z.string().min(1, 'Team is required'),
  division_id: z.string().min(1, 'Director is required'),
  subcity_id: z.string().optional(),
  office_number: z.string().min(1, 'Office number is required'),
  floor_number: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: 'Floor number is required and must be a number',
  }),
  profile_picture: z
    .any()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine((file) => !file || file.type?.startsWith('image/'), 'Please select an image file')
    .optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export function AddEmployeeDialog({ onSuccess }: AddEmployeeDialogProps) {
  const { t } = useLanguage();
  const { createEmployee, isCreatingEmployee } = useEmployees();
  const { Sectors, Directors, Subcities, Teams } = useOrganization();
  const { user } = useAuthStore();

  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedDirector, setSelectedDirector] = useState<Division | null>(null);
  const [filteredDirectors, setFilteredDirectors] = useState<Division[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);

  useEffect(() => {
    const desiredSector = Sectors.find((sector) => sector.id === user?.sector_id);
    setSelectedSector(desiredSector!);
    if (user?.division_id) {
      const desiredDirector = Directors.find((director) => director.id === user?.division_id);
      setSelectedDirector(desiredDirector!);
    }
  }, [user]);
  useEffect(() => {
    if (selectedSector) {
      setFilteredDirectors(
        Directors.filter((director) => director.sector_id === selectedSector.id)
      );
      setSelectedDirector(null);
      setFilteredTeams([]);
    }
  }, [selectedSector, Directors]);

  useEffect(() => {
    if (selectedDirector) {
      setFilteredTeams(Teams.filter((team) => team.division_id === selectedDirector.id));
    }
  }, [selectedDirector, Teams]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name_en: '',
      first_name_am: '',
      first_name_af: '',
      middle_name_en: '',
      middle_name_am: '',
      middle_name_af: '',
      last_name_en: '',
      last_name_am: '',
      last_name_af: '',
      position_en: '',
      position_am: '',
      position_af: '',
      section: '',
      city: '',
      sector_id: '',
      works_in_head_office: false,
      division_id: '',
      department_id: '',
      subcity_id: '',
      office_number: '',
      floor_number: '',
      profile_picture: undefined,
    },
  });

  const profilePicture = watch('profile_picture');

  const onSubmit = async (formData: EmployeeFormData) => {
    try {
      const payload = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        if (value !== null && value !== undefined) {
          if (key === 'profile_picture' && value instanceof File) {
            payload.append(key, value);
          } else {
            payload.append(key, value.toString());
          }
        }
      }

      console.log(payload);
      const response = await createEmployee(payload);
      handleApiSuccess(response.message);
      setOpen(false);
      reset();
    } catch (error: any) {
      handleApiError(error?.message || 'Failed to add employee');
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          {t('addEmployee') || 'Add Employee'}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the employee information. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="position">Position</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>First Name (English) *</Label>
                  <Input {...register('first_name_en')} placeholder="John" />
                  {errors.first_name_en && (
                    <p className="text-red-500 text-sm">{errors.first_name_en.message}</p>
                  )}
                </div>
                <div>
                  <Label>First Name (Amharic)</Label>
                  <Input {...register('first_name_am')} placeholder="ጆን" />
                </div>
                <div>
                  <Label>First Name (Afaan Oromo)</Label>
                  <Input {...register('first_name_af')} placeholder="Johni" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Middle Name (English)</Label>
                  <Input {...register('middle_name_en')} placeholder="Michael" />
                </div>
                <div>
                  <Label>Middle Name (Amharic)</Label>
                  <Input {...register('middle_name_am')} placeholder="ሚካኤል" />
                </div>
                <div>
                  <Label>Middle Name (Afaan Oromo)</Label>
                  <Input {...register('middle_name_af')} placeholder="Mikaeli" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Last Name (English) *</Label>
                  <Input {...register('last_name_en')} placeholder="Smith" />
                  {errors.last_name_en && (
                    <p className="text-red-500 text-sm">{errors.last_name_en.message}</p>
                  )}
                </div>
                <div>
                  <Label>Last Name (Amharic)</Label>
                  <Input {...register('last_name_am')} placeholder="ስሚዝ" />
                </div>
                <div>
                  <Label>Last Name (Afaan Oromo)</Label>
                  <Input {...register('last_name_af')} placeholder="Smitii" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="position" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Position (English) *</Label>
                  <Input {...register('position_en')} placeholder="Senior Officer" />
                  {errors.position_en && (
                    <p className="text-red-500 text-sm">{errors.position_en.message}</p>
                  )}
                </div>
                <div>
                  <Label>Position (Amharic)</Label>
                  <Input {...register('position_am')} placeholder="ከፍተኛ ባለሙያ" />
                </div>
                <div>
                  <Label>Position (Afaan Oromo)</Label>
                  <Input {...register('position_af')} placeholder="Ogeessa Ol'aanaa" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Sector */}
                <Controller
                  control={control}
                  name="sector_id"
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(val) => {
                        field.onChange(val);
                        const sector = Sectors.find((s) => String(s.id) === val) || null;
                        setSelectedSector(sector);
                      }}
                      // disabled={}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedSector?.name_en ?? 'Select Sector'} />
                      </SelectTrigger>
                      <SelectContent>
                        {Sectors.map((sector) => (
                          <SelectItem key={sector.id} value={String(sector.id)}>
                            {sector.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* Director */}
                <Controller
                  control={control}
                  name="division_id"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        const director = Directors.find((d) => String(d.id) === val) || null;
                        setSelectedDirector(director);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedDirector?.name_en || 'Select director'} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDirectors.map((director) => (
                          <SelectItem key={director.id} value={String(director.id)}>
                            {director.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* Team */}
                <Controller
                  control={control}
                  name="department_id"
                  render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Team" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTeams.map((team) => (
                          <SelectItem key={team.id} value={String(team.id)}>
                            {team.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </TabsContent>

            {/* LOCATION */}
            <TabsContent value="location" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Subcity *</Label>
                  <Controller
                    control={control}
                    name="subcity_id"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subcity" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(Subcities) &&
                            Subcities.map((subcity) => (
                              <SelectItem key={subcity.id} value={String(subcity.id)}>
                                {subcity.name_en}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subcity_id && (
                    <p className="text-red-500 text-sm">{errors.subcity_id.message}</p>
                  )}
                </div>

                <div className="flex h-full pt-3 items-center space-x-2">
                  <Controller
                    name="works_in_head_office"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        className="h-6 w-6"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="works_in_head_office">Works in head office?</Label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Office Number *</Label>
                  <Input {...register('office_number')} placeholder="A-101" />
                  {errors.office_number && (
                    <p className="text-red-500 text-sm">{errors.office_number.message}</p>
                  )}
                </div>
                <div>
                  <Label>Floor Number *</Label>
                  <Input type="number" {...register('floor_number')} placeholder="1" />
                  {errors.floor_number && (
                    <p className="text-red-500 text-sm">{errors.floor_number.message}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* PROFILE */}
            <TabsContent value="profile" className="space-y-4">
              <Label>Profile Picture</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue('profile_picture', file);
                  }
                }}
              />
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      profilePicture instanceof File
                        ? URL.createObjectURL(profilePicture)
                        : '/placeholder.svg?height=64&width=64'
                    }
                  />
                  <AvatarFallback>NE</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </Button>
              </div>
              {errors.profile_picture && (
                <p className="text-red-500 text-sm">{'Profile picutre is required'}</p>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex gap-2 py-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreatingEmployee}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingEmployee}>
              {isCreatingEmployee && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
