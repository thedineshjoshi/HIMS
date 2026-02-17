export interface CreateAppointmentDto {
    firstName: string;
    middleName?: string;
    lastName: string;
    contactNumber: string;
    
    bloodGroup: string;
    gender: string;
    address: string;
    email: string;
    dateOfBirth: string;
    
    doctorId: string;
    appointmentDate: string; 
    reasonForVisit: string;
    createdBy: string;
}