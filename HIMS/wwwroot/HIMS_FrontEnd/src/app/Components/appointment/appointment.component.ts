import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ApiCallService } from '../../Service/api-call.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';


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
              this.isNewPatient=false;
            }
            else{
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
      DateOfBirth: [''],
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
  
  bookAppointment(){
    this.appointmentForm.patchValue({
  CreatedBy: '11111111-1111-1111-1111-111111111111'
});
    const appointmentData=this.appointmentForm.value;
    this.apiService.addAppointment(appointmentData).subscribe(
      res=>{
        console.log(res);
      },
      err=>{
        console.log(err);
      }
    )
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


}
