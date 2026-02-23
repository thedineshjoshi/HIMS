import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ApiCallService } from '../../Service/api-call.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-appointment',
  imports: [CommonModule, ReactiveFormsModule, AgGridAngular],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit {
  existingPatientFound: any = null;
  appointmentForm!: FormGroup;
  rowData: any[] = [];
  patients: any[] = [];
  patient:any;
  doctors: any[] = [];
  isEditMode = false;
  isNewPatient:boolean=false;
  isPatientFound:boolean=false;
  selectedDoctorId:string='';
  editingStatusId: string | null = null;
  getRowId = (params: any) => params.data.id || params.data.appointmentId;

  

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Appt ID', width: 100 },
    { field: 'patientName', headerName: 'Patient', flex: 1 },
    { field: 'doctorName', headerName: 'Doctor', flex: 1 },
    { field: 'appointmentDate', headerName: 'Date & Time', flex: 1, 
      valueFormatter: params => new Date(params.value).toLocaleString() 
    },
    { field: 'reasonForVisit', headerName: 'Reason For Visit', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120,
      cellRenderer: (params: any) => {
      if (this.editingStatusId === params.data.id) {
        return `
          <select class="form-select form-select-sm" data-action="select-status">
            <option value="Scheduled" ${params.value === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
            <option value="Completed" ${params.value === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${params.value === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>`;
      }
      const color = params.value === 'Cancelled' ? 'danger' : params.value === 'Completed' ? 'success' : 'primary';
      return `<span class="badge bg-${color}">${params.value}</span>`;
    }
    },
    {
      headerName: 'Actions',
      minWidth:250,
      cellRenderer: (params: any) => {
        const isCancelled = params.data?.status === 'Cancelled';
        return `
          <button class="btn btn-sm btn-primary me-2" data-action="status">
        <i class="bi bi-pencil"></i> Change Status
      </button>
      <button class="btn btn-sm btn-danger" data-action="delete">
        <i class="bi bi-trash"></i> Delete
      </button>`;
      },
      onCellClicked: (params: any) => {
        if (!params.data) return;
       const action = params.event.target.closest('button')?.getAttribute('data-action');

      if (action === 'status') {
        this.toggleStatusEdit(params.data.id, params.api);
      } else if (action === 'delete') {
        this.onDelete(params.data.id);
      }
      }
    }
  ]

  constructor(private fb: FormBuilder, private apiService: ApiCallService, private toastr:ToastrService){
    this.initForm();
  }

  ngOnInit() {
    this.initForm();
    this.getDoctors();
    this.getAppointments();

    this.appointmentForm.get('DoctorId')?.valueChanges.subscribe(id => {
    this.selectedDoctorId=id;
    
  });
    this.appointmentForm.valueChanges.pipe(debounceTime(500)).subscribe(value=>{
      const firstName=value.FirstName;
      const lastName=value.LastName;
      const contactNumber = value.ContactNumber;
      if (firstName && lastName && contactNumber) {
        this.apiService.searchPatient(firstName,lastName,contactNumber).subscribe(
          res=>{
            
            this.patient=res;
            if(this.patient!=null)
            {
              this.toastr.success("Old Patinet Found");
              this.isNewPatient=false;
            }
            else{
              this.toastr.success("New Patient");
              this.isNewPatient=true;
            }
          },
          err=>{
            console.log(err);
        }
        )
      }
    }
  )
}

  initForm() {
    
    this.appointmentForm = this.fb.group(
      {
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      ContactNumber: ['', Validators.required],

      MiddleName: [''],
      Email: ['', [Validators.email]],
      DateOfBirth: ['',[Validators.required]],
      BloodGroup: [''],
      Gender: [''],
      Address: [''],

      DoctorId: [this.selectedDoctorId, Validators.required],
      AppointmentDate: ['', Validators.required],
      ReasonForVisit: ['', Validators.required],
      CreatedBy: ['']
    }
  );
}
  
  getDoctors(){
    this.apiService.getDoctors().subscribe(
      res=>{
           this.doctors=res;
      },
      err=>{
        console.log(err);
      }
    )
  }

  validateDOB = (control: any) => {
  if (!control.value) return null;
  const today = new Date();
  const dob = new Date(control.value);
  return dob > today ? { invalidDOB: true } : null;
}
  
  bookAppointment() {
  const doctorId = this.appointmentForm.get('DoctorId')?.value;
  const apptDate = this.appointmentForm.get('AppointmentDate')?.value;
  if (this.isDoctorBusy(doctorId, apptDate)) {
    this.toastr.error("Doctor is already booked for this slot!");
    return;
  }

  if (this.appointmentForm.invalid) {
    this.appointmentForm.markAllAsTouched();
    return;
  }

  this.appointmentForm.patchValue({
    CreatedBy: '11111111-1111-1111-1111-111111111111'
  });

  const appointmentData = this.appointmentForm.value;
  this.apiService.addAppointment(appointmentData).subscribe(
    res => {
      this.toastr.success("Appointment Booked Successfully");
      this.closeModal();
      this.getAppointments();
    },
    err => {
      this.toastr.error(err.error?.message || "Error while booking appointment");
    }
  );
}

  getAppointments(){
    this.apiService.getAppointments().subscribe(
      res=>{
          this.rowData=res;
          console.log(res);
    },
    err=>{
      console.log(err);

    }
  )
  }

  toggleStatusEdit(id: any, gridApi: any) {
  this.editingStatusId = id;
  gridApi.refreshCells({ rowNodes: [gridApi.getRowNode(id)], force: true });
  setTimeout(() => {
    const select = document.querySelector(`select[data-action="select-status"]`) as HTMLSelectElement;
    
    if (select) {
      select.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLSelectElement;
        const newValue = target.value;        
        this.changeAppointmentStatus(id, newValue, gridApi);
      });
    }
  }, 100);
}

  changeAppointmentStatus(id: string, newStatus: string, gridApi: any) {
  this.apiService.updateAppointmentStatus(id, newStatus).subscribe({
    next: (res) => {
      this.toastr.success("Appointment Status Updated Successfully");
      this.editingStatusId = null; 
      this.getAppointments(); 
    },
    error: (err) => {
      this.toastr.error("Failed to update appointment status");
    }
    });
  }

  onDelete(appointmentId:any){ 
    const confirmed = window.confirm("Are you sure you want to delete this patient?");
      if(confirmed)
        {
          this.apiService.deleteAppointment(appointmentId).subscribe(
            res=>{
              alert("Deleted Successfully"),
              this.getAppointments();
            },
            err=>{
              console.log(err);
            }
          )
        }
  }

  validateFutureDate = (control: any) => {
    if (!control.value) return null;
    return new Date(control.value) < new Date() ? { pastDate: true } : null;
  }

  openModal() {
    this.isNewPatient=false;
    this.isPatientFound=false;
    this.appointmentForm.reset();
    const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
    modal.show();
  }

  closeModal() {
 const modalEl = document.getElementById('appointmentModal');
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

  this.appointmentForm.reset();
  this.isEditMode = false;
}

  isDoctorBusy(doctorId: string, appointmentTime: string): boolean {
  if (!doctorId || !appointmentTime) return false;
  const newDate = new Date(appointmentTime).getTime();

  return this.rowData.some(appt => {
    const existingDate = new Date(appt.appointmentDate).getTime();
    return appt.doctorId === doctorId && 
           existingDate === newDate && 
           appt.status !== 'Cancelled';
  });
}
}
