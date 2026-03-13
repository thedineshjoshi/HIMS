import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from '../../Service/auth.service';
import { CommonModule } from '@angular/common';
import { ApiCallService } from '../../Service/api-call.service';
import { AppointmentViewModel } from '../../../Models/ViewModels/appointmentViewModel';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, SidebarComponent, RouterOutlet,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  appointments:AppointmentViewModel[]=[];
  totalPendingAppointments:number=0;
  totalCompletedAppointments:number=0;
  role:string='';
  userId:string='';
  username:string='';
  ngOnInit(){
      this.getRole();
      this.getUserId();
      this.getAppointments();
      this.getUsername();
    }
    constructor(private authService:AuthService, private apiCallService:ApiCallService){}

  getRole(){
    this.role = this.authService.decodeToken().Role;
  }

  getUserId(){
    this.userId = this.authService.decodeToken().UserId;
  }

  getUsername(){
    this.username = this.authService.decodeToken().UserName;
  }

  getAppointments(){
    this.apiCallService.getAppointmentsOfDoctor(this.userId).subscribe(res=>{
      this.appointments = res;
      this.totalPendingAppointments= this.appointments.filter(a=>a.status==='Scheduled').length;
      this.totalCompletedAppointments = this.appointments.filter(a=>a.status==='Completed').length;
      },
    err=>{
      console.log(err);
    });
}
}
