import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../Model/Patient';
import { AddStaffDto } from '../../Models/DTOs/Staff/addStaffDto';
import { StaffDto } from '../../Models/DTOs/Staff/staffDto';
import { UpdateStaffDto } from '../../Models/DTOs/Staff/updateStaffDto';
import { AddPatientDto } from '../../Models/DTOs/Patient/addPatientDto';
import { PatientDto } from '../../Models/DTOs/Patient/patientDto';
import { UpdatePatientDto } from '../../Models/DTOs/Patient/updatePatientDto';
import { AddAppointmentDto } from '../../Models/DTOs/Appointment/addAppointmentDto';
import { AppointmentDto } from '../../Models/DTOs/Appointment/appointmentDto';
import { DoctorDto } from '../../Models/DTOs/Doctor/doctorDto';


@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  constructor(private http:HttpClient) {}
  private staffUrl = 'https://localhost:7082/api/Staff';
  private patientUrl = 'https://localhost:7082/api/Patient';
  private appointmentUrl = 'https://localhost:7082/api/Appointment';
  private doctorUrl = 'https://localhost:7082/api/Doctor';

  // Start Of Staff Service
  addStaff(staff:AddStaffDto):Observable<StaffDto>{
    return this.http.post<StaffDto>(`${this.staffUrl}`,staff,{responseType:'json'});
  }
  getAllStaffs(page:number,size:number):Observable<{items:StaffDto[],totalRecords:number }>{
    return this.http.get<{ items: StaffDto[], totalRecords: number }>(`${this.staffUrl}?pageNumber=${page}&pageSize=${size}`,{responseType:'json'});
  }
  getStaffById(id:string):Observable<StaffDto>{
    return this.http.get<StaffDto>(`${this.staffUrl}/${id}`,{responseType:'json'});
  }
  updateStaff(id:string, staff:UpdateStaffDto):Observable<any>{
    return this.http.put<void>(`${this.staffUrl}/${id}`,staff,{responseType:'json'});
  }
  deleteStaff(id:string):Observable<void>{
    return this.http.delete<void>(`${this.staffUrl}/${id}`,{responseType:'json'})
  }
   
  // End Of Staff Service

  //Start Of Patient Service
  addPatient(patient:AddPatientDto):Observable<PatientDto>{
    return this.http.post<PatientDto>(`${this.patientUrl}`,patient,{responseType:'json'});
  }

  updatePatient(id:string, patient:UpdatePatientDto):Observable<PatientDto>{
    return this.http.put<PatientDto>(`${this.patientUrl}/${id}`,patient,{responseType:'json'});
  }

  getAllPatients(page:number,size:number):Observable<{items:PatientDto[],totalRecords:number }>{
    return this.http.get<{items:PatientDto[],totalRecords:number }>(`${this.patientUrl}?pageNumber=${page}&pageSize=${size}`,{responseType:'json'});
  }

  getPatientById(id:string):Observable<PatientDto>{
    return this.http.get<PatientDto>(`${this.patientUrl}/${id}`,{responseType:'json'});
  }

  deletePatient(id:string):Observable<void>{
    return this.http.delete<void>(`${this.patientUrl}/${id}`,{responseType:'json'})
  }

  searchPatient(firstName: string, lastName: string, contactNumber: string): Observable<PatientDto> {
  return this.http.get<PatientDto>(`${this.appointmentUrl}/check-patient?firstName=${firstName}&lastName=${lastName}&contactNumber=${contactNumber}`);
}

  //end of patient service

  //start of appointment service

  addAppointment(addAppointmentDto: AddAppointmentDto): Observable<AddAppointmentDto> {
    return this.http.post<AddAppointmentDto>(`${this.appointmentUrl}`, addAppointmentDto,{responseType:'json'});
  }

  getAppointments(): Observable<AppointmentDto[]> {
    return this.http.get<AppointmentDto[]>(`${this.appointmentUrl}`);
  }

  updateAppointmentStatus(id: string, newStatus: string): Observable<AppointmentDto> {
    return this.http.patch<AppointmentDto>(`${this.appointmentUrl}/${id}?status=${newStatus}`,{});
  }

  deleteAppointment(id:string):Observable<void>
  {
    return this.http.delete<void>(`${this.appointmentUrl}/${id}`,{responseType:'json'})
  }
  //end of appointment service

  //start of doctor service
  getDoctors():Observable<DoctorDto[]>{
    return this.http.get<DoctorDto[]>(`${this.doctorUrl}`,{responseType:'json'})
  }



}
