import { Router, Routes } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  localStorage: any;
  constructor(private router: Router) {
    this.localStorage = localStorage;
  }

  checkLogin(){
    if(!this.localStorage.email){
      this.router.navigate(['login'])
    }
  }
}
