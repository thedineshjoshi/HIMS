import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Staff } from '../Model/Staff';
import { Patient } from '../Model/Patient';


@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  constructor(private http:HttpClient) {}
  private staffUrl = 'https://localhost:7082/api/Staff';
  private patientUrl = 'https://localhost:7082/api/Patient';
  private appointmentUrl = 'https://localhost:7082/api/Appointment'

  // Start Of Staff Service
  addStaff(staff:Staff):Observable<any>{
    return this.http.post(`${this.staffUrl}`,staff,{responseType:'json'});
  }
  getAllStaffs(page:number,size:number):Observable<any>{
    return this.http.get(`${this.staffUrl}?pageNumber=${page}&pageSize=${size}`,{responseType:'json'});
  }
  getStaffById(id:string):Observable<any>{
    return this.http.get(`${this.staffUrl}/${id}`,{responseType:'json'});
  }
  updateStaff(id:string, staff:Staff):Observable<any>{
    return this.http.put(`${this.staffUrl}/${id}`,staff,{responseType:'json'});
  }
  deleteStaff(id:string):Observable<any>{
    return this.http.delete(`${this.staffUrl}/${id}`,{responseType:'json'})
  }
   
  // End Of Staff Service

  //Start Of Patient Service
  addPatient(patient:Patient):Observable<any>{
    return this.http.post(`${this.patientUrl}`,patient,{responseType:'json'});
  }

  updatePatient(id:string, patient:Patient):Observable<any>{
    return this.http.put(`${this.patientUrl}/${id}`,patient,{responseType:'json'});
  }

  getAllPatients(page:number,size:number):Observable<any>{
    return this.http.get(`${this.patientUrl}?pageNumber=${page}&pageSize=${size}`,{responseType:'json'});
  }

  getPatientById(id:string):Observable<any>{
    return this.http.get(`${this.patientUrl}/${id}`,{responseType:'json'});
  }

  deletePatient(id:string):Observable<any>{
    return this.http.delete(`${this.patientUrl}/${id}`,{responseType:'json'})
  }

  searchPatient(firstName: string, lastName: string, contact: string): Observable<any> {
  return this.http.get(`${this.patientUrl}/SearchPatient?firstName=${firstName}&lastName=${lastName}&contact=${contact}`);
}

  //end of patient service

  //start of appointment service

  addAppointment(appointmentData: any): Observable<string> {
    return this.http.post<string>(`${this.appointmentUrl}`, appointmentData);
  }

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.appointmentUrl}`);
  }

  updateAppointmentStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.appointmentUrl}/${id}`, { status });
  }



}
