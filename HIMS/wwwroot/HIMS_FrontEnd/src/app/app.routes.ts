import { Routes } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { StaffComponent } from './Components/staff/staff.component';

export const routes: Routes = [
    {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'staffmanagement', component: StaffComponent },
      
    ]
}
];
