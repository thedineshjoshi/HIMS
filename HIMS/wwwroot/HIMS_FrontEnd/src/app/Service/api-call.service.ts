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
   
}
