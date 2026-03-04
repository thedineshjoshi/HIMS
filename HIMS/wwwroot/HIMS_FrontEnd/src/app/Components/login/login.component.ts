import { Component } from '@angular/core';
import { ApiCallService } from '../../Service/api-call.service';
import { LoginDto } from '../../../Models/DTOs/Login/LoginDto';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!:FormGroup
  initForm(){
    this.loginForm = this.fb.group({
      Username : ['',Validators.required],
      Password:['',Validators.required]

    })
  }

  ngOnInit(){
    this.initForm();
  }
  constructor(private apiCallService:ApiCallService,  private toastr:ToastrService, private fb:FormBuilder, private _route:Router){}

  login(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    const loginData:LoginDto = this.loginForm.value;
    this.apiCallService.login(loginData).subscribe(res=>{
      this._route.navigateByUrl('HIMS');
      this.toastr.success("Login Successfully")
      console.log(res);
    })
  }
}
