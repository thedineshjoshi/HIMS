export interface AddStaffDto{
    Salutation:string;
    FirstName:string;
    MiddleName:string;
    LastName:string;
    DateOfBirth:string;
    Gender:string;
    Address:string;
    Email:string;
    ContactNumber:string;
    Role:number;
    Specialization?:string;
    Department?:string;
    Qualification?:string;
    LicenseNumber?:string;
    HiringDate:string;
    Salary:number;
}