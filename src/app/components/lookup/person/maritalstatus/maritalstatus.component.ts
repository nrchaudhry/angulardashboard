
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-maritalstatus',
  templateUrl: './maritalstatus.component.html',
  styleUrls: ['./maritalstatus.component.css']
})
export class MaritalstatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  maritalstatusID = null;

  maritalstatuses = [];
  maritalstatusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.maritalstatuses = JSON.parse(window.sessionStorage.getItem('maritalstatuses'));
    this.maritalstatusesAll = JSON.parse(window.sessionStorage.getItem('maritalstatusesAll'));
    if (this.disabled == false && this.maritalstatuses == null) {
      this.maritalstatusGet();
    } else if (this.disabled == true && this.maritalstatusesAll == null) {
      this.maritalstatusGetAll();
    }
  }

  setMaritalstatuses(response) {
    if (this.disabled == false) {
      this.maritalstatuses = response;
      window.sessionStorage.setItem("maritalstatuses", JSON.stringify(this.maritalstatuses));
    } else {
      this.maritalstatusesAll = response;
      window.sessionStorage.setItem("maritalstatusesAll", JSON.stringify(this.maritalstatusesAll));
    }
  }

  maritalstatusGet(){
    this.lookupservice.lookup("MARITALSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setMaritalstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  maritalstatusGetAll(){
    this.lookupservice.lookupAll("MARITALSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setMaritalstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}