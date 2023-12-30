import { HttpHeaders, HttpClientModule, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  url : string  = 'http://localhost/1/helpyourself/api/';
  headers = new HttpHeaders({
    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
    'Authorization': 'jg84jfk0e9k90k093htj' });
  options = { headers: this.headers };

  constructor(private http : HttpClient) { }

  login(data: any){
    return this.http.post(this.url, data, this.options);
  }
  sendOtp(data: any){
    return this.http.post(this.url+'getOtp.php', data, this.options);
  }
  verifyOtp(data: any){
    return this.http.post(this.url+'verifyOtp.php', data, this.options);
  }
  register(data: any){
    return this.http.post(this.url+'register.php', data, this.options);
  }
  addRequest(data: any){
    return this.http.post(this.url+'addRequest.php', data, this.options);
  }
  getHelpStatus(data:any){
    return this.http.post(this.url+'getHelpData.php', data, this.options);
  }

  updateStatus(data:any){
    return this.http.post(this.url+'updateRequest.php', data, this.options);
  }

  fetchRequest(data:any){
    return this.http.post(this.url+'listRequest.php', data, this.options);
  }
  updateDistance(data:any){
    return this.http.post(this.url+'updateDistance.php', data, this.options);
  }

}
