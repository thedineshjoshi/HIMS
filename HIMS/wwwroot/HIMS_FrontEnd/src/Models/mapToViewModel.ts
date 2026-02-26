import { StaffRoleConfig } from "../app/Enums/role.enum";
import { StaffViewModel } from "./ViewModels/staffViewModel";
import { StaffDto } from "./DTOs/Staff/staffDto";
import { PatientDto } from "./DTOs/Patient/patientDto";
import { PatientViewModel } from "./ViewModels/patientViewModel";
import { AppointmentDto } from "./DTOs/Appointment/appointmentDto";
import { AppointmentViewModel } from "./ViewModels/appointmentViewModel";

export function mapStaffDtoToViewModel(dto: StaffDto): StaffViewModel {
  return {
    id: dto.id,
    fullName: `${dto.firstName} ${dto.middleName ?? ''} ${dto.lastName}`.trim(),
    dateOfBirth: dto.dateOfBirth.split('T')[0],
    contactNumber: dto.contactNumber,
    role: dto.role
  };
}

export function mapPatientDtoToViewModel(dto:PatientDto):PatientViewModel{
  return {
    id: dto.id,
    fullName: `${dto.firstName} ${dto.middleName ?? ''} ${dto.lastName}`.trim(),
    gender: dto.gender,
    bloodGroup: dto.bloodGroup,
    contactNumber: dto.contactNumber,
    address: dto.address,
    dateOfBirth: dto.dateOfBirth
  };
}

  export function mapAppointmentDtoToViewModel(dto:AppointmentDto):AppointmentViewModel{

    return {
      id:dto.id,
      fullName:`${dto.firstName} ${dto.middleName ?? ''} ${dto.lastName}`.trim(),
      doctorId:dto.doctorId,
      doctorName:dto.doctorName,
      appointmentDate:dto.appointmentDate,
      reasonForVisit:dto.reasonForVisit,
      status:dto.status,
      patientName:dto.patientName
    };

  };