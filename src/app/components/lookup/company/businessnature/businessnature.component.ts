
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-businessnature',
  templateUrl: './businessnature.component.html',
  styleUrls: ['./businessnature.component.css']
})
export class BusinessnatureComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  businessnatureID = null;

  businessnatures = [];
  businessnaturesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.businessnatures = JSON.parse(window.sessionStorage.getItem('businessnatures'));
    this.businessnaturesAll = JSON.parse(window.sessionStorage.getItem('businessnaturesAll'));

    if (this.businessnatures == null) {
      this.businessnatureGet();
    } 
    
    if (this.businessnaturesAll == null) {
      this.businessnatureGetAll();
    }
  }

  businessnatureGet(){
    this.lookupservice.lookup("BUSINESSNATURE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.businessnatures = response;
          window.sessionStorage.setItem("businessnatures", JSON.stringify(this.businessnatures));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  businessnatureGetAll(){
    this.lookupservice.lookupAll("BUSINESSNATURE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.businessnaturesAll = response;
          window.sessionStorage.setItem("businessnaturesAll", JSON.stringify(this.businessnaturesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}