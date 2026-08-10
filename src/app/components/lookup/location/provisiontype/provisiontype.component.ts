
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-provisiontype',
  templateUrl: './provisiontype.component.html',
  styleUrls: ['./provisiontype.component.css']
})
export class ProvisiontypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  provisiontypeID = null;

  provisiontypes = [];
  provisiontypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.provisiontypes = JSON.parse(window.sessionStorage.getItem('provisiontypes'));
    this.provisiontypesAll = JSON.parse(window.sessionStorage.getItem('provisiontypesAll'));
    if (this.disabled == false && this.provisiontypes == null) {
      this.provisiontypeGet();
    } else if (this.disabled == true && this.provisiontypesAll == null) {
      this.provisiontypeGetAll();
    }
  }

  setProvisiontypes(response) {
    if (this.disabled == false) {
      this.provisiontypes = response;
      window.sessionStorage.setItem("provisiontypes", JSON.stringify(this.provisiontypes));
    } else {
      this.provisiontypesAll = response;
      window.sessionStorage.setItem("provisiontypesAll", JSON.stringify(this.provisiontypesAll));
    }
  }

  provisiontypeGet(){
    this.lookupservice.lookup("PROVISIONTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setProvisiontypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  provisiontypeGetAll(){
    this.lookupservice.lookupAll("PROVISIONTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setProvisiontypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}