export interface Service {
  id: number;
  name: string;
  description: string;
  detailedDescription: string;
  requirements: string[];
  standardTime: string;
  fee: string;
  department: string;
  contactPerson: number;
  location: string;
  availability: string;
  steps: string[];
  status: string;
  popularity: number;
}
