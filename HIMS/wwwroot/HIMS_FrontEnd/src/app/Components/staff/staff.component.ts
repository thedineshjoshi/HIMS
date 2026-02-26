import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiCallService } from '../../Service/api-call.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { StaffRole, StaffRoleConfig } from '../../Enums/role.enum';
import { ToastrService } from 'ngx-toastr';
import { StaffDto } from '../../../Models/DTOs/Staff/staffDto';
import { StaffViewModel } from '../../../Models/ViewModels/staffViewModel';
import { AddStaffDto } from '../../../Models/DTOs/Staff/addStaffDto';
import { UpdateStaffDto } from '../../../Models/DTOs/Staff/updateStaffDto';
import { mapStaffDtoToViewModel } from '../../../Models/mapToViewModel';



declare var bootstrap: any;
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  standalone:true,
  selector: 'app-staff',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, AgGridAngular],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})

export class StaffComponent implements OnInit {
  isEditMode: boolean = false;
  selectedStaffId: string | null = null;
  addStaffForm!:FormGroup;
  editStaffForm!:FormGroup;
  staffList: StaffDto[]=[];
  totalRecords=0;
  pageNumber:number=0;
  pageSize=7;
  totalPages:number=0;
  currentPage = 1;
  public rowData: StaffViewModel[] = [];



  columnDefs:ColDef[]=[
    {field: 'id', headerName: 'Staff ID', flex: 1, filter: true },
    {field:'fullName',headerName:'Full Name', flex:1, filter:true},
    {field:'dateOfBirth', headerName:'Date Of Birth', flex:1, filter:true},
    {field:'contactNumber', headerName:'Contact Number', flex:1, filter:true},
{
    field: 'role',
    headerName: 'Role',
    flex: 1,
    filter: true,
    cellRenderer: (params: any) => {
      const roleEnum = params.value as StaffRole;
      const config = StaffRoleConfig[roleEnum];
      if (!config) return `<span>Unknown</span>`;
      return `
        <span class="badge" style="
          background-color: ${config.color}22; 
          color: ${config.color}; 
          border: 1px solid ${config.color};
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        ">
          ${config.label}
        </span>
      `;
    }
  },    {
      headerName: 'Actions',
      cellRenderer: (params: any) =>
      {
        return `
            <button class="btn btn-sm btn-outline-primary me-2" data-action="edit">
        <i class="bi bi-pencil"></i> Edit
      </button>
      <button class="btn btn-sm btn-outline-danger" data-action="delete">
        <i class="bi bi-trash"></i> Delete
      </button>
        `;
      },
      onCellClicked: (params: any) => {
    const action = params.event.target.getAttribute('data-action') || 
                   params.event.target.parentElement.getAttribute('data-action');
    
    if (action === 'edit') {
      this.getStaffById(params.data.id);
    } else if (action === 'delete') {
      this.deleteStaff(params.data.id);
    }
  }
    }
  ]
  
  ngOnInit(){
    this.getAllStaffs(1);
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
        Salary: ['', [Validators.required, Validators.min(0)]],
        Specialization: [''],
        Department: [''],
        Qualification: [''],
        LicenseNumber: ['']
    })
  }
  constructor(private apiCallService:ApiCallService,private fb:FormBuilder,private toastr:ToastrService){
 }

 get isDoctor(): boolean {
  return this.addStaffForm.get('Role')?.value === 1;
}

 validateDOB(control: any) {
  if (!control.value) return null;
  const today = new Date();
  const dob = new Date(control.value);
  return dob > today ? { invalidDOB: true } : null;
}

  getAllStaffs(page: number = 1){
    this.apiCallService.getAllStaffs(page, this.pageSize).subscribe(
      res=>{
        this.staffList=res.items;
        this.rowData = res.items.map(item =>
        mapStaffDtoToViewModel(item)
      );
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
    this.getAllStaffs();
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.getAllStaffs();
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

  
  if (this.isEditMode && this.selectedStaffId) {
    const updateStaffData:UpdateStaffDto = this.addStaffForm.value;
    this.apiCallService.updateStaff(this.selectedStaffId, updateStaffData).subscribe(
      res => {
        this.getAllStaffs();
        this.closeModal();
        this.toastr.success("Staff Added Succesffuly")
      },
      err => this.toastr.error("Failed To add staff")
    );
  } else {
    const addStaffData: AddStaffDto = this.addStaffForm.value;
    this.apiCallService.addStaff(addStaffData).subscribe(
      res => {
        this.getAllStaffs();
        this.closeModal();
        this.toastr.success("Staff Added Succesffuly")
      },
      err => this.toastr.error("Failed To add staff")
    );
  }
}


  deleteStaff(id:string) {
    const confirmed = window.confirm("Are you sure you want to delete this staff?");
    if(confirmed)
    {
    this.apiCallService.deleteStaff(id).subscribe(
      res=>{
        this.getAllStaffs();
        this.toastr.success("Staff Deleted Succesffuly")
      },
      err=>{
          this.toastr.error("Failed To Delete staff")
      }
    )

  }
}

triggerAddModal() {
  this.isEditMode = false;
  this.selectedStaffId = null;
  this.addStaffForm.reset();
  this.addStaffForm.get('Role')?.setValue('');
  this.openAddModal();
}

handleModalCleanup() {
  this.addStaffForm.reset();
  this.isEditMode = false;
  this.selectedStaffId = null;
}

openAddModal() {
  const modalEl = document.getElementById('AddemployeeModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modalEl.addEventListener('hidden.bs.modal', () => {
      this.handleModalCleanup();
    }, { once: true });

    modal.show();
  }
}

closeModal() {
 const modalEl = document.getElementById('AddemployeeModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  }

  const backdrops = document.getElementsByClassName('modal-backdrop');
  while (backdrops.length > 0) {
    backdrops[0].remove();
  }
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  this.addStaffForm.reset();
  this.isEditMode = false;
  this.selectedStaffId = null;
}

}
