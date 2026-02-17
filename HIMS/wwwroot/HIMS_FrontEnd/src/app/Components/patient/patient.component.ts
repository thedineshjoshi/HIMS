import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../Model/Patient';
import { ApiCallService } from '../../Service/api-call.service';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
declare var bootstrap: any;

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-patient',
  imports: [CommonModule,ReactiveFormsModule,AgGridAngular],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {
  alertMessage: string = '';
  alertType: string = ''; 
  showAlert: boolean = false;
  patientForm!: FormGroup;
  isEditMode: boolean = false;
  selectedPatientId: string | null = null;
  PatientList: any;
  totalRecords=0;
  pageNumber:any;
  pageSize=7;
  totalPages:any;
  currentPage = 1;
  public rowData: any[] = [];

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Patient ID', flex: 1, filter: true }, // Changed ID to id
  { field: 'firstName', headerName: 'First Name', flex: 1, filter: true }, // Changed FirstName to firstName
  { field: 'lastName', headerName: 'Last Name', flex: 1, filter: true },  // Changed LastName to lastName
  { field: 'gender', headerName: 'Gender', width: 100 },
  { field: 'bloodGroup', headerName: 'Blood Group', width: 120 },
  { field: 'contactNumber', headerName: 'Contact Number', flex: 1 },
  { field: 'address', headerName: 'Address', flex: 1 },
  { field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1 },
    { 
      headerName: 'Actions', 
      cellRenderer: (params: any) => {
        // This creates a button inside the grid cell
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
  }
    }
  ];

  constructor(private fb: FormBuilder, private apiCallService:ApiCallService) {
  this.initForm();
}
ngOnInit(){
  this.getAllPatient();
}

  initForm() {
  this.patientForm = this.fb.group({
        FirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        MiddleName: ['', [Validators.minLength(0), Validators.maxLength(50)]], // optional
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

  const patientData:Patient=this.patientForm.value;
  if (this.isEditMode && this.selectedPatientId) {
    this.apiCallService.updatePatient(this.selectedPatientId, patientData).subscribe(
      res => {
        this.getAllPatient();
        this.closeModal();
        this.showAlertMessage('Patient updated successfully!', 'success');
      },
      err => this.showAlertMessage('Failed to update Patient!', 'danger')
    );
  } else {
    this.apiCallService.addPatient(patientData).subscribe(
      res => {
        this.getAllPatient();
        this.closeModal();
        this.showAlertMessage('Patient added successfully!', 'success');
      },
      err => this.showAlertMessage('Failed to add Patient!', 'danger')
    );
  }
}
 getAllPatient(page: number = 1){
    this.apiCallService.getAllPatients(page, this.pageSize).subscribe(
      res=>{
        this.PatientList=res.items;
        this.rowData = res.items;
        this.pageNumber = res.pageNumber;
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
        this.getAllPatient();
         this.alertMessage = 'Patient Deleted successfully!';
      this.alertType = 'success';
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 3000);
      },
      err=>{
        this.alertMessage = 'Failed to delete Patient!';
      this.alertType = 'danger';
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 3000);
      }
    )

  }

  }
  opentModal() {
 if (!this.isEditMode) {
    this.selectedPatientId = null;
    this.patientForm.reset();
  }
  const modalEl = document.getElementById('PatientModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
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

showAlertMessage(message: string, type: 'success' | 'danger') {
  this.alertMessage = message;
  this.alertType = type;
  
  this.showAlert = true; 

  setTimeout(() => {
    this.showAlert = false;
  }, 3000);
}
}

