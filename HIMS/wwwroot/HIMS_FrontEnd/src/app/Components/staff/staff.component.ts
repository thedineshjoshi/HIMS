import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { ApiCallService } from '../../Service/api-call.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Staff } from '../../Model/Staff';

@Component({
  selector: 'app-staff',
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit {
  addStaffForm!:FormGroup;
  staffList: any;
  ngOnInit(){
    this.getAllStaff();
    this.addStaffForm=this.fb.group({
      FirstName:['',Validators.required],
      MiddleName:['',Validators.required],
      LastName:['',Validators.required],
      Gender:['',Validators.required],
      Address:['',Validators.required],
      ContactNumber:['',Validators.required],
      Email:['',Validators.required],
      BloodGroup:['',Validators.required],
      DateOfBirth:['',Validators.required],
      Salutation:['',Validators.required],
      Role:['',Validators.required],
      HiringDate:['',Validators.required],
      Salary:['',Validators.required],
    })
  }
  constructor(private apiCallService:ApiCallService,private fb:FormBuilder){
 }
  getAllStaff(){
    this.apiCallService.getAllStaffs().subscribe(
      res=>{
        this.staffList=res;
        console.log(res);
      },
      err=>{
        console.log(err);
      }
    )
  }
  addStaff(){
    if (this.addStaffForm.invalid) {
    this.addStaffForm.markAllAsTouched();
    return;
  }
    const staffData:Staff = this.addStaffForm.value;
    this.apiCallService.addStaff(staffData).subscribe(
    res => {
      console.log("Staff added successfully", res);
      this.addStaffForm.reset();
       this.getAllStaff();
    },
    err => {
      console.log("Error Occured", err);
    }
  );
  }

  editStaff(staff: Staff) {
    console.log('Edit staff', staff);
    // Open edit modal or navigate to edit page
  }

  deleteStaff(id: string) {
    
  }
}
