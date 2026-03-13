import { Routes } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { StaffComponent } from './Components/staff/staff.component';
import { PatientComponent } from './Components/patient/patient.component';
import { AppointmentComponent } from './Components/appointment/appointment.component';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuardService } from './Service/auth-guard.service';

export const routes: Routes = [
    {
    path: 'HIMS',
    component: LayoutComponent,
    children: [
      { path: 'staff', component: StaffComponent, canActivate:[AuthGuardService] },
      {path:'patient',component:PatientComponent, canActivate:[AuthGuardService]},
      {path:'appointment',component:AppointmentComponent, canActivate:[AuthGuardService]}
      
    ]
  },
  {
    path:'',component:LoginComponent
  }
];
