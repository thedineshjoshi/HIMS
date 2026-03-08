import { Component } from '@angular/core';
import { StaffComponent } from '../../staff/staff.component';
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from '../../../Service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  role:string='';
  ngOnInit(){
    this.getRole();
  }
  constructor(private authService:AuthService, private route:Router){}
  Logout(){
    this.authService.logout();
    this.route.navigateByUrl('');
  }
  getRole(){
    this.role = this.authService.decodeToken().Role;
  }

}
