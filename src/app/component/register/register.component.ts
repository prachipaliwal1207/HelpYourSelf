import { Router } from '@angular/router';
import { ApiServiceService } from './../../services/api-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loginAs: string = '';
  step: number = 0;
  otp: string = '';
  email: string = '';
  password: string = '';
  otpError: string = '';

  name: string = '';
  mobileno: string = '';
  vehicleNo: string = '';
  contactPerson1: string = '';
  contactPersonC1: string = '';
  contactPerson2: string = '';
  contactPersonC2: string = '';

  constructor(private apiService: ApiServiceService, private router: Router) {

  }

  ngOnInit() {

  }

  sendOtp() {
    let data = {
      email: this.email,
      type: 'register',
      type2: this.loginAs
    }
    this.apiService.sendOtp(data).subscribe((res: any) => {
      console.log(res)
      this.step++;
    }, (err: any) => {
      console.log(err)
    })
  }
  verifyOtp() {
    let data = {
      email: this.email,
      type: this.loginAs,
      otp: this.otp
    }
    this.apiService.verifyOtp(data).subscribe((res: any) => {
      // console.log(res)
      if (res.status == 200) {
        this.step++;
        if (this.loginAs == 'ambulance') {
          this.contactPerson1 = ' ';
          this.contactPersonC1 = ' ';
          this.contactPerson2 = ' ';
          this.contactPersonC2 = ' ';
        }
      } else {
        this.otpError = 'Invalid OTP';
      }
    }, (err: any) => {
      console.log(err)
    })
  }
  doRegister() {
    let data = {
      email: this.email,
      name: this.name,
      mobileno: this.mobileno,
      vehicleNo: this.vehicleNo,
      contactPerson1: this.contactPerson1,
      contactPersonC1: this.contactPersonC1,
      contactPerson2: this.contactPerson2,
      contactPersonC2: this.contactPersonC2,
      type: this.loginAs,
    }
    this.apiService.register(data).subscribe((res: any) => {
      if (res.status == 200) {
        localStorage['email'] = this.email;
        localStorage['userData'] = JSON.stringify(data)
        this.router.navigate(['']);
      }
    }, (err: any) => {
      console.log(err)
    })
  }
}
