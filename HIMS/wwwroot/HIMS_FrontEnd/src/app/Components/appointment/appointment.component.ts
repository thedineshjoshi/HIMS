import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ApiCallService } from '../../Service/api-call.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap: any;
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-appointment',
  imports: [CommonModule, ReactiveFormsModule, AgGridAngular],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit {
  isNewPatient:boolean=false;
  existingPatientFound: any = null;
  appointmentForm!: FormGroup;
  rowData: any[] = [];
  patients: any[] = [];
  doctors: any[] = [];
  isEditMode = false;

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Appt ID', width: 100 },
    { field: 'patientName', headerName: 'Patient', flex: 1 },
    { field: 'doctorName', headerName: 'Doctor', flex: 1 },
    { field: 'appointmentDateTime', headerName: 'Date & Time', flex: 1, 
      valueFormatter: params => new Date(params.value).toLocaleString() 
    },
    { field: 'status', headerName: 'Status', width: 120,
      cellRenderer: (params: any) => {
        const color = params.value === 'Cancelled' ? 'danger' : params.value === 'Completed' ? 'success' : 'primary';
        return `<span class="badge bg-${color}">${params.value}</span>`;
      }
    },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
          <button class="btn btn-sm btn-outline-danger" data-action="cancel" ${params.data.status === 'Cancelled' ? 'disabled' : ''}>
            <i class="bi bi-x-circle"></i> Cancel
          </button>`;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.getAttribute('data-action') === 'cancel') {
        }
      }
    }
  ]

  constructor(private fb: FormBuilder, private apiService: ApiCallService){
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    this.appointmentForm = this.fb.group(
      {
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      ContactNumber: ['', Validators.required],

      MiddleName: [''],
      Email: ['', [Validators.email]],
      DateOfBirth: [''],
      BloodGroup: [''],
      Gender: [''],
      Address: [''],

      DoctorId: ['', Validators.required],
      AppointmentDate: ['', Validators.required],
      ReasonForVisit: ['', Validators.required],
      CreatedBy: ['00000000-0000-0000-0000-000000000000']
    }
  );
}

  

  
  validateFutureDate = (control: any) => {
    if (!control.value) return null;
    return new Date(control.value) < new Date() ? { pastDate: true } : null;
  }


  openModal() {
    this.appointmentForm.reset();
    const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
    modal.show();
  }


}
