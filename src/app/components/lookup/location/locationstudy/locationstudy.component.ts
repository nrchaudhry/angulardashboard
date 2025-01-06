
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-locationstudy',
  templateUrl: './locationstudy.component.html',
  styleUrls: ['./locationstudy.component.css']
})
export class LocationstudyComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  locationstudyID = null;

  locationstudies = [];
  locationstudiesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.locationstudies = JSON.parse(window.sessionStorage.getItem('locationstudies'));
    this.locationstudiesAll = JSON.parse(window.sessionStorage.getItem('locationstudiesAll'));
    if (this.disabled == false && this.locationstudies == null) {
      this.locationstudyGet();
    } else if (this.disabled == true && this.locationstudiesAll == null) {
      this.locationstudyGetAll();
    }
  }

  setLocationstudies(response) {
    if (this.disabled == false) {
      this.locationstudies = response;
      window.sessionStorage.setItem("locationstudies", JSON.stringify(this.locationstudies));
    } else {
      this.locationstudiesAll = response;
      window.sessionStorage.setItem("locationstudiesAll", JSON.stringify(this.locationstudiesAll));
    }
  }

  locationstudyGet(){
    this.lookupservice.lookup("LOCATIONSTUDY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLocationstudies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  locationstudyGetAll(){
    this.lookupservice.lookupAll("LOCATIONSTUDY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLocationstudies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}