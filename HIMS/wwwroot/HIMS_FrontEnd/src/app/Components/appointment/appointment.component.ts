import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ApiCallService } from '../../Service/api-call.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, combineLatest, startWith } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgGridAngular],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']  
})
export class AppointmentComponent implements OnInit {

  appointmentForm!: FormGroup;
  rowData: any[] = [];
  doctors: any[] = [];
  patient: any;

  isEditMode = false;
  isNewPatient = false;
  doctorBusy = false; 
  selectedDoctorId: string = '';
  editingStatusId: string | null = null;
  submitted = false;
  getRowId = (params: any) => params.data.id;

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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiCallService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getDoctors();
    this.getAppointments();
    this.listenDoctorChange();
    this.listenPatientSearch();
    this.listenDoctorBusyCheck();
  }

  initForm() {
    this.appointmentForm = this.fb.group({

      FirstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern("^[a-zA-Z ]+$")
      ]],

      MiddleName: ['', [
        Validators.pattern("^[a-zA-Z ]*$")
      ]],

      LastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern("^[a-zA-Z ]+$")
      ]],

      ContactNumber: ['', [
        Validators.required,
        Validators.pattern("^[0-9]{10}$")
      ]],

      Email: [''],
      DateOfBirth: [''],
      BloodGroup: [''],
      Gender: [''],
      Address: [''],

      DoctorId: ['', Validators.required],

      AppointmentDate: ['', [
        Validators.required,
        this.pastDateValidator 
      ]],

      ReasonForVisit: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
      ]],

      CreatedBy: ['']
    });
  }

  get f() {
    return this.appointmentForm.controls;
  }


  validateDOB = (control: AbstractControl) => {
    if (!control.value) return null;

    const dob = new Date(control.value);
    const today = new Date();

    return dob > today ? { invalidDOB: true } : null;
  };

  pastDateValidator = (control: AbstractControl) => {
    if (!control.value) return null;

    const selected = new Date(control.value);
    const now = new Date();

    return selected < now ? { pastDate: true } : null;
  };


  listenPatientSearch() {
    combineLatest([
      this.appointmentForm.get('FirstName')!.valueChanges.pipe(startWith('')),
      this.appointmentForm.get('LastName')!.valueChanges.pipe(startWith('')),
      this.appointmentForm.get('ContactNumber')!.valueChanges.pipe(startWith(''))
    ])
    .pipe(debounceTime(500))
    .subscribe(([firstName, lastName, contactNumber]) => {

      if (firstName && lastName && contactNumber) {
        this.apiService.searchPatient(firstName, lastName, contactNumber)
          .subscribe(res => {

            this.patient = res;

            if (this.patient) {
              this.toastr.success("Existing Patient Found");
              this.isNewPatient = false;
              this.removeNewPatientValidators();
            } else {
              this.toastr.info("New Patient Registration Required");
              this.isNewPatient = true;
              this.applyNewPatientValidators();
            }
          });
      }
    });
  }

  applyNewPatientValidators() {
    this.f['Email'].setValidators([Validators.required, Validators.email]);
    this.f['DateOfBirth'].setValidators([Validators.required, this.validateDOB]);
    this.f['Gender'].setValidators([Validators.required]);

    this.f['Email'].updateValueAndValidity();
    this.f['DateOfBirth'].updateValueAndValidity();
    this.f['Gender'].updateValueAndValidity();
  }

  removeNewPatientValidators() {
    this.f['Email'].clearValidators();
    this.f['DateOfBirth'].clearValidators();
    this.f['Gender'].clearValidators();

    this.f['Email'].updateValueAndValidity();
    this.f['DateOfBirth'].updateValueAndValidity();
    this.f['Gender'].updateValueAndValidity();
  }


  listenDoctorBusyCheck() {
    combineLatest([
      this.appointmentForm.get('DoctorId')!.valueChanges.pipe(startWith('')),
      this.appointmentForm.get('AppointmentDate')!.valueChanges.pipe(startWith(''))
    ])
    .subscribe(([doctorId, date]) => {
      this.doctorBusy = this.isDoctorBusy(doctorId, date);
    });
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

  listenDoctorChange() {
    this.appointmentForm.get('DoctorId')?.valueChanges.subscribe(id => {
      this.selectedDoctorId = id;
    });
  }


  bookAppointment() {

    this.submitted = true;

    if (this.appointmentForm.invalid || this.doctorBusy) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.appointmentForm.patchValue({
      CreatedBy: '11111111-1111-1111-1111-111111111111'
    });

    this.apiService.addAppointment(this.appointmentForm.value)
      .subscribe({
        next: () => {
          this.toastr.success("Appointment Booked Successfully");
          this.closeModal();
          this.getAppointments();
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error?.message || "Error booking appointment");
        }
      });
  }


  getDoctors() {
    this.apiService.getDoctors()
      .subscribe(res => this.doctors = res);
  }

  getAppointments() {
    this.apiService.getAppointments()
      .subscribe(res => {
        this.rowData = res,
        console.log(res);
      });
  }

  onDelete(id: any) {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      this.apiService.deleteAppointment(id)
        .subscribe(() => {
          this.toastr.success("Deleted Successfully");
          this.getAppointments();
        });
    }
  }

  toggleStatusEdit(id: any, gridApi: any) {
  this.editingStatusId = id;
  const node = gridApi.getRowNode(id.toString());
  gridApi.refreshCells({ rowNodes: [node], force: true });
  setTimeout(() => {
    const select = document.querySelector(`select[data-action="select-status"]`) as HTMLSelectElement;
    
    if (select) {
      select.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLSelectElement;
        const newValue = target.value;        
        this.changeAppointmentStatus(id, newValue, gridApi);
      });
    }
    else{
      console.error("Could not find row node with ID:", id);
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

  openModal() {
    this.isNewPatient = false;
    this.submitted = false;
    this.doctorBusy = false;
    this.appointmentForm.reset();

    const modal = new bootstrap.Modal(
      document.getElementById('appointmentModal')
    );
    modal.show();
  }

  closeModal() {
    const modalEl = document.getElementById('appointmentModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }

    this.appointmentForm.reset();
    this.isEditMode = false;
    this.isNewPatient = false;
    this.doctorBusy = false;
  }
}