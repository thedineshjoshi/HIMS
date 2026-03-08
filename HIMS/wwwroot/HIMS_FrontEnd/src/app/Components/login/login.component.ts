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
      Password:['',Validators.required],
      rememberMe:[false]

    })
  }

  ngOnInit(){
    this.initForm();
     const rememberMe = JSON.parse(
      localStorage.getItem('rememberMe') || 'false'
    );
    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    if (rememberMe) {
      this.loginForm.patchValue({
        Username: username,
        Password: password,
        rememberMe: true,
      });
    }
  }
  constructor(private apiCallService:ApiCallService,  private toastr:ToastrService, private fb:FormBuilder, private _route:Router){}

  login(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    const loginData:LoginDto = this.loginForm.value;

    if (this.loginForm.value.rememberMe){
      localStorage.setItem('rememberMe', JSON.stringify(true));
      localStorage.setItem('username', loginData.Username);
      localStorage.setItem('password', loginData.Password);
    }else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }

    this.apiCallService.login(loginData).subscribe(res=>{
      if(res.token)
      {
      localStorage.setItem('token', res.token);
      this._route.navigateByUrl('HIMS');
      this.toastr.success("Login Successfully")
      console.log(res);
      }
    })
  }
}
