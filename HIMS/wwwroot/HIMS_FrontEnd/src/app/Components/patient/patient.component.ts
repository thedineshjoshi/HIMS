import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../Model/Patient';
import { ApiCallService } from '../../Service/api-call.service';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { PatientDto } from '../../../Models/DTOs/Patient/patientDto';
import { PatientViewModel } from '../../../Models/ViewModels/patientViewModel';
import { AddPatientDto } from '../../../Models/DTOs/Patient/addPatientDto';
import { UpdatePatientDto } from '../../../Models/DTOs/Patient/updatePatientDto';
import { mapPatientDtoToViewModel } from '../../../Models/mapToViewModel';
declare var bootstrap: any;

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-patient',
  imports: [CommonModule,ReactiveFormsModule,AgGridAngular],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {
  patientForm!: FormGroup;
  isEditMode: boolean = false;
  selectedPatientId: string | null = null;
  patientList: PatientDto[]=[];
  totalRecords=0;
  pageNumber:number=0;
  pageSize=7;
  totalPages:number=0;
  currentPage = 1;
  public rowData: PatientViewModel[] = [];

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Patient ID', flex: 1, filter: true },
    { field: 'fullName', headerName: 'Full Name', flex: 1, filter: true }, 
    { field: 'bloodGroup', headerName: 'Blood Group', width: 120 },
    { field: 'contactNumber', headerName: 'Contact Number', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1 },
    { 
      headerName: 'Actions', 
      cellRenderer: (params: any) => {
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
      this.getPatientById(params.data.id);
    } else if (action === 'delete') {
      this.deletePatient(params.data.id);
    }
    else if (action === 'View') {
    this.viewPatient(params.data.id);
  }
  }
    }
  ];

  constructor(private fb: FormBuilder, private apiCallService:ApiCallService, private toastr:ToastrService) {
  }
  ngOnInit(){
    this.getAllPatients();
    this.initForm();
}

  initForm() {
  this.patientForm = this.fb.group({
        FirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        MiddleName: ['', [Validators.minLength(0), Validators.maxLength(50)]],
        LastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        DateOfBirth: ['', [Validators.required, this.validateDOB]],
        BloodGroup:['',[Validators.required,]],
        Gender: ['', Validators.required],
        Address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        Email: ['', [Validators.required, Validators.email]],
        ContactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  });
}

validateDOB = (control: any) => {
  if (!control.value) return null;
  const today = new Date();
  const dob = new Date(control.value);
  return dob > today ? { invalidDOB: true } : null;
}

submitPatient() {
  if (this.patientForm.invalid) {
    this.patientForm.markAllAsTouched();
    return;
  }

  if (this.isEditMode && this.selectedPatientId) {
    const updatePatientData:UpdatePatientDto=this.patientForm.value;
    this.apiCallService.updatePatient(this.selectedPatientId, updatePatientData).subscribe(
      res => {
        this.toastr.success("Patient Updated Successfully");
        this.getAllPatients();
        this.closeModal();
      },
      err=>{
        this.toastr.error("Failed to update patient");
      }
    );
  } else {
    const addPatientData:AddPatientDto=this.patientForm.value;
    this.apiCallService.addPatient(addPatientData).subscribe(
      res => {
        this.toastr.success("Patient Added Successfully");
        this.getAllPatients();
        this.closeModal();
      },
      err => {
        this.toastr.error("Failed to add patient");
      }
    );
  }
}

  viewPatient(id: string) {
  this.apiCallService.getPatientById(id).subscribe(
    res => {
      this.patientForm.patchValue({
        FirstName: res.firstName,
        MiddleName: res.middleName,
        LastName: res.lastName,
        DateOfBirth: res.dateOfBirth,
        BloodGroup: res.bloodGroup,
        Gender: res.gender,
        Address: res.address,
        Email: res.email,
        ContactNumber: res.contactNumber
      });

      this.patientForm.disable();
      this.isEditMode = false;

      this.opentModal();
    },
    err => {
      this.toastr.error("Failed to load patient");
    }
  );
}

 getAllPatients(page: number = 1){
    this.apiCallService.getAllPatients(page, this.pageSize).subscribe(
      res=>{
        this.patientList=res.items;
        this.rowData = res.items.map(item =>
                mapPatientDtoToViewModel(item));
        this.totalRecords = res.totalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        console.log(res);
      },
      err=>{
        console.log(err);
      }
    )
  }

  getPatientById(id:string)
  {
     this.isEditMode=true;
     this.selectedPatientId = id;
     this.apiCallService.getPatientById(id).subscribe(
      res=>{
        this.patientForm.patchValue({
        FirstName: res.firstName,
        MiddleName: res.middleName,
        LastName: res.lastName,
        DateOfBirth: res.dateOfBirth,
        BloodGroup: res.bloodGroup,
        Gender: res.gender,
        Address: res.address,
        Email: res.email,
        ContactNumber: res.contactNumber
      });
      this.opentModal();
  },
      err=>{
        console.log(err);
      }
     )
  }

  deletePatient(id:string){
    const confirmed = window.confirm("Are you sure you want to delete this patient?");
    if(confirmed)
    {
    this.apiCallService.deletePatient(id).subscribe(
      res=>{
        this.toastr.success("Patient deleted successfully");
        this.getAllPatients();
      },
      err=>{
        this.toastr.error("Failed to delete patient");
      }
    )

  }

  }

  openAddModal() {
  this.isEditMode = false;
  this.selectedPatientId = null;
  this.patientForm.enable();
  this.patientForm.reset();
  this.opentModal();
}

  opentModal() {
 if (!this.isEditMode) {
    this.patientForm.reset();
  }
  
  const modalEl = document.getElementById('PatientModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    
    modalEl.addEventListener('hidden.bs.modal', () => {
      this.handleModalHidden();
    }, { once: true });
  }
}

handleModalHidden() {
  this.patientForm.reset();
  this.isEditMode = false;
  this.selectedPatientId = null;
}

closeModal() {
 const modalEl = document.getElementById('PatientModal');
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

  this.patientForm.reset();
  this.isEditMode = false;
  this.selectedPatientId = null;
}
}
