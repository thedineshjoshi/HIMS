import { Component } from '@angular/core';
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
export class AppointmentComponent {
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
          this.cancelAppointment(params.data.id);
        }
      }
    }
  ]

  constructor(private fb: FormBuilder, private apiService: ApiCallService){
    this.initForm();
  }

  ngOnInit() {
    this.loadInitialData();
  }

  initForm() {
    this.appointmentForm = this.fb.group({
      PatientId: ['', Validators.required],
      DoctorId: ['', Validators.required],
      AppointmentDateTime: ['', [Validators.required, this.validateFutureDate]],
      Notes: ['']
    });
  }

  validateFutureDate = (control: any) => {
    if (!control.value) return null;
    return new Date(control.value) < new Date() ? { pastDate: true } : null;
  }

  loadInitialData() {
    this.apiService.getAllPatients(1, 100).subscribe(res => this.patients = res.items);
    this.apiService.getAllStaffs(1, 100).subscribe(res => this.doctors = res.items.filter((s:any) => s.role === 1)); // Filter for Doctors
    this.getAppointments();
  }

  getAppointments() {
    this.apiService.getAppointments().subscribe(res => this.rowData = res);
  }

  openModal() {
    this.appointmentForm.reset();
    const modal = new bootstrap.Modal(document.getElementById('AppointmentModal'));
    modal.show();
  }

  submitAppointment() {
    if (this.appointmentForm.valid) {
      this.apiService.addAppointment(this.appointmentForm.value).subscribe(() => {
        this.getAppointments();
        bootstrap.Modal.getInstance(document.getElementById('AppointmentModal')).hide();
      });
    }
  }

  cancelAppointment(id: string) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.apiService.updateAppointmentStatus(id, 'Cancelled').subscribe(() => this.getAppointments());
    }
  }

}
