export interface StaffDto{
  id: string;
  salutation: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  email: string;
  contactNumber: string;
  role: number;
  specialization?: string;
  department?: string;
  qualification?: string;
  licenseNumber?: string;
  hiringDate: string;
  salary: number;
}