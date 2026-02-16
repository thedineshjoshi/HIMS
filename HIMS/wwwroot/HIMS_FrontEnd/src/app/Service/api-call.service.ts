import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Staff } from '../Model/Staff';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  constructor(private http:HttpClient) {}
  private staffUrl = 'https://localhost:7082/api/Staff';
  addStaff(staff:Staff):Observable<any>{
    return this.http.post(`${this.staffUrl}`,staff,{responseType:'json'});
  }
  getAllStaffs():Observable<any>{
    return this.http.get(`${this.staffUrl}`,{responseType:'json'});
  }
  getStaffById(id:string):Observable<any>{
    return this.http.get(`${this.staffUrl}/${id}`,{responseType:'json'});
  }
  UpdateStaff(id:string, staff:Staff):Observable<any>{
    return this.http.patch(`${this.staffUrl}/${id}`,staff,{responseType:'json'});
  }
  DeleteStaff(id:string):Observable<any>{
    return this.http.delete(`${this.staffUrl}/${id}`,{responseType:'json'})
  }
   
}
