import { Routes } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { StaffComponent } from './Components/staff/staff.component';
import { PatientComponent } from './Components/patient/patient.component';
import { AppointmentComponent } from './Components/appointment/appointment.component';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [
    {
    path: 'HIMS',
    component: LayoutComponent,
    children: [
      { path: 'staff', component: StaffComponent },
      {path:'patient',component:PatientComponent},
      {path:'appointment',component:AppointmentComponent}
      
    ]
  },
  {
    path:'',component:LoginComponent
  }
];
