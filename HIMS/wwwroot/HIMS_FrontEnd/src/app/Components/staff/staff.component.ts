import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiCallService } from '../../Service/api-call.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Staff } from '../../Model/Staff';

declare var bootstrap: any;

@Component({
  selector: 'app-staff',
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})

export class StaffComponent implements OnInit {
  isEditMode: boolean = false;
  selectedStaffId: string | null = null;
  addStaffForm!:FormGroup;
  editStaffForm!:FormGroup;
  staffList: any;
  alertMessage: string = '';
  totalRecords=0;
  pageNumber:any;
  pageSize=8;
  totalPages:any;
  currentPage = 1;
  alertType: string = ''; 
  showAlert: boolean = false;
  ngOnInit(){
    this.getAllStaff(1);
    this.addStaffForm=this.fb.group({
        Salutation: ['', Validators.required],
        FirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        MiddleName: ['', [Validators.minLength(0), Validators.maxLength(50)]], // optional
        LastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        DateOfBirth: ['', [Validators.required, this.validateDOB]],
        Gender: ['', Validators.required],
        Address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        Email: ['', [Validators.required, Validators.email]],
        ContactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // 10-digit number
        Role: ['', Validators.required],
        HiringDate: ['', Validators.required],
        Salary: ['', [Validators.required, Validators.min(0)]]
    })
  }
  constructor(private apiCallService:ApiCallService,private fb:FormBuilder){
 }

 validateDOB(control: any) {
  if (!control.value) return null;
  const today = new Date();
  const dob = new Date(control.value);
  return dob > today ? { invalidDOB: true } : null;
}

  getAllStaff(page: number = 1){
    this.apiCallService.getAllStaffs(page, this.pageSize).subscribe(
      res=>{
        this.staffList=res.items;
        this.pageNumber = res.pageNumber;
      this.totalRecords = res.totalRecords;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      },
      err=>{
        console.log(err);
      }
    )
  }

  nextPage() {
  if (this.currentPage * this.pageSize < this.totalRecords) {
    this.currentPage++;
    this.getAllStaff();
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.getAllStaff();
  }
}

  getStaffById(id:string) {
      this.isEditMode=true;
     this.selectedStaffId = id;
   this.apiCallService.getStaffById(id).subscribe(
      res=>{
        console.log(res);
  this.addStaffForm.patchValue({
    Salutation: res.salutation,
    FirstName: res.firstName,
    MiddleName: res.middleName,
    LastName: res.lastName,
    DateOfBirth: res.dateOfBirth?.split('T')[0],
    Gender: res.gender,
    Address: res.address,
    Email: res.email,
    ContactNumber: res.contactNumber,
    Role: res.role,
    HiringDate: res.hiringDate?.split('T')[0],
    Salary: res.salary
  });
  this.openAddModal();
    console.log(this.isEditMode);


},
err=>{
  console.log(err);
}
   );
 
}
submitStaff() {
  if (this.addStaffForm.invalid) {
    this.addStaffForm.markAllAsTouched();
    return;
  }

  const staffData: Staff = this.addStaffForm.value;
  if (this.isEditMode && this.selectedStaffId) {
    // Update staff
    this.apiCallService.updateStaff(this.selectedStaffId, staffData).subscribe(
      res => {
        this.getAllStaff();
        this.closeModal();
        this.showAlertMessage('Staff updated successfully!', 'success');
      },
      err => this.showAlertMessage('Failed to update staff!', 'danger')
    );
  } else {
    // Add staff
    this.apiCallService.addStaff(staffData).subscribe(
      res => {
        this.getAllStaff();
        this.closeModal();
        this.showAlertMessage('Staff added successfully!', 'success');
      },
      err => this.showAlertMessage('Failed to add staff!', 'danger')
    );
  }
}


  deleteStaff(id:string) {
    const confirmed = window.confirm("Are you sure you want to delete this staff?");
    if(confirmed)
    {
    this.apiCallService.deleteStaff(id).subscribe(
      res=>{
        this.getAllStaff();
         this.alertMessage = 'Staff Deleted successfully!';
      this.alertType = 'success';
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 3000);
      },
      err=>{
        this.alertMessage = 'Failed to delete staff!';
      this.alertType = 'danger';
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 3000);
      }
    )

  }
}

openAddModal() {
 if (!this.isEditMode) {
    this.selectedStaffId = null;
    this.addStaffForm.reset();
  }
  const modalEl = document.getElementById('AddemployeeModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

closeModal() {
 const modalEl = document.getElementById('AddemployeeModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  }

  // Manually remove the "stuck" backdrop
  const backdrops = document.getElementsByClassName('modal-backdrop');
  while (backdrops.length > 0) {
    backdrops[0].remove();
  }

  // Reset the body style so you can scroll again
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  this.addStaffForm.reset();
  this.isEditMode = false;
  this.selectedStaffId = null;
}

showAlertMessage(message: string, type: 'success' | 'danger') {
  this.alertMessage = message;
  this.alertType = type;
  
  // Step 1: Trigger Right -> Left animation
  this.showAlert = true; 

  // Step 2: After 3 seconds, trigger Left -> Right exit animation
  setTimeout(() => {
    this.showAlert = false;
  }, 3000);
}

}
