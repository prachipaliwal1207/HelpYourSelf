import { Router } from '@angular/router';
import { ApiServiceService } from './../../services/api-service.service';
import { AppServiceService } from './../../services/app-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name: string = '';
  userData: any = '';
  isLive: boolean = false;
  liveStatus: number = 0;
  requestData: any = '';
  userType: string = '';
  requestDataList: any = [];
  errorMsg: string = '';


  constructor(private appService: AppServiceService, private apiService: ApiServiceService, private router: Router) {

  }
  ngOnInit() {
    this.appService.checkLogin();
    this.userData = JSON.parse(localStorage['userData']);

    this.name = this.userData.name;
    this.userType = this.userData.type;
    this.loadData();
  }

  loadData() {
    if (localStorage['helpId'] != undefined && localStorage['helpId'] !== 0) {
      this.isLive = true;
      setInterval(() => {
        this.helperData()
      }, 5000);
    }


    if (this.userData.type == "ambulance") {
      setInterval(() => {
        if (localStorage['trackingId'] != undefined && localStorage['trackingId'] !== 0) {
          this.isLive = true;
          this.updateMyLocation();
          this.helperData();
          this.requestDataList = [];
        } else {
          this.fetchRequests();
        }
      }, 5000);
    }
  }
  helpMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos: any) => {
        this.addSupport(pos);
      });
    } else {
      console.log("Geolocation is not supported")
    }
  }

  addSupport(position: any) {
    let data = {
      "userId": this.userData.id,
      "email": this.userData.email,
      "lat": position.coords.latitude,
      "long": position.coords.longitude,
      "accuracy": position.coords.accuracy
    }
    this.apiService.addRequest(data).subscribe((res: any) => {
      if (res.status == 200) {
        localStorage['helpId'] = res.data;
        this.isLive = true;
        this.liveStatus = 1;
        this.loadData();
      }
    }, (err: any) => {
      console.log(err)
    })
  }

  helperData() {
    if (this.isLive) {
      let d = {
        "helpId": this.userData.type == "ambulance" ? localStorage['trackingId'] : localStorage['helpId']
      }
      this.apiService.getHelpStatus(d).subscribe((res: any) => {
        this.requestData = res.data;
        this.liveStatus = res.data.status
        if (this.liveStatus == 5) {
          localStorage.removeItem("helpId");
          localStorage.removeItem("trackingId");
          this.isLive = false
        }
      }, (err: any) => {
        console.log(err)
      })
    }
  }

  updateReuqest(status: any) {
    let d = {
      status: status,
      id: localStorage['helpId'] ? localStorage['helpId'] : localStorage['trackingId']
    }
    this.apiService.updateStatus(d).subscribe((res: any) => {
      if (res.status == 200) {
        this.helperData();
        if (status == 5) {
          localStorage.removeItem("helpId");
          this.isLive = !this.isLive
        }
      }
    }, (err: any) => {
      console.log(err)
    })
  }

  doLogout() {
    localStorage.removeItem("helpId");
    localStorage.removeItem("userData");
    localStorage.removeItem("email");
    this.router.navigate(['login'])
  }


  fetchRequests() {
    let d = {
      type: this.userData.type,
      userId: this.userData.email,
      helperLat: '',
      helperLong: '',
      helperSpeed: '',
      helperAccuracy: '',

    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos: any) => {
        d.helperLat = pos.coords.latitude
        d.helperLong = pos.coords.longitude
        d.helperSpeed = pos.coords.speed
        d.helperAccuracy = pos.coords.accuracy
        this.apiService.fetchRequest(d).subscribe((res: any) => {
          if (res.status == 200) {
            if (res.data.length > 0) {
              this.requestDataList = res.data;
              this.errorMsg = '';
            } else {
              this.errorMsg = 'No Current Request';
            }
          } else {
            this.errorMsg = 'No Current Request';
          }
        }, (err: any) => {
          console.log(err)
        })
      });
    } else {
      console.log("Geolocation is not supported")
    }
  }

  accpetRequest(list: any) {
    if(confirm("Accept Request?")){
      localStorage['trackingId'] = list.id;
      this.isLive = true;
      let d = {
        status: 2,
        id: localStorage['trackingId'],
        helperId: this.userData.email
      }
      this.apiService.updateStatus(d).subscribe((res: any) => {
        if (res.status == 200) {
          this.loadData();
        }
      }, (err: any) => {
        console.log(err)
      })
    }
  }
  updateMyLocation() {
    let d = {
      userId: this.userData.email,
      helperLat: '',
      helperLong: '',
      helperSpeed: '',
      helperAccuracy: '',
      request: localStorage['trackingId']
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos: any) => {
        d.helperLat = pos.coords.latitude
        d.helperLong = pos.coords.longitude
        d.helperSpeed = pos.coords.speed
        d.helperAccuracy = pos.coords.accuracy
        this.apiService.updateDistance(d).subscribe((res: any) => {
          if (res.status == 200) {
          }
        }, (err: any) => {
          console.log(err)
        })
      });
    } else {
      console.log("Geolocation is not supported")
    }
  }
}
