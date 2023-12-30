import { Router } from '@angular/router';
import { ApiServiceService } from './../../services/api-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginAs: string = '';
  email: string = '';
  step: number = 0;
  otpError: string = '';
  otp: string = '';

  constructor(private apiService: ApiServiceService, private router: Router) {

  }

  ngOnInit() {

  }

  sendOtp() {
    let data = {
      email: this.email,
      type: 'login',
      type2: this.loginAs
    }
    this.apiService.sendOtp(data).subscribe((res: any) => {
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
        localStorage['email'] = this.email;
        localStorage['userData'] = JSON.stringify(res.data);
        this.router.navigate([''])
      } else {
        this.otpError = 'Invalid OTP';
      }
    }, (err: any) => {
      console.log(err)
    })
  }
}
