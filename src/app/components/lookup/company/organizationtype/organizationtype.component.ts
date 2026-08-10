
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-organizationtype',
  templateUrl: './organizationtype.component.html',
  styleUrls: ['./organizationtype.component.css']
})
export class OrganizationtypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  organizationtypeID = null;

  organizationtypes = [];
  organizationtypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.organizationtypes = JSON.parse(window.sessionStorage.getItem('organizationtypes'));
    this.organizationtypesAll = JSON.parse(window.sessionStorage.getItem('organizationtypesAll'));
    if (this.disabled == false && this.organizationtypes == null) {
      this.organizationtypeGet();
    } else if (this.disabled == true && this.organizationtypesAll == null) {
      this.organizationtypeGetAll();
    }
  }

  setOrganizationtypes(response) {
    if (this.disabled == false) {
      this.organizationtypes = response;
      window.sessionStorage.setItem("organizationtypes", JSON.stringify(this.organizationtypes));
    } else {
      this.organizationtypesAll = response;
      window.sessionStorage.setItem("organizationtypesAll", JSON.stringify(this.organizationtypesAll));
    }
  }

  organizationtypeGet(){
    this.lookupservice.lookup("ORGANIZATIONTYPES").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setOrganizationtypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationtypeGetAll(){
    this.lookupservice.lookupAll("ORGANIZATIONTYPES").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setOrganizationtypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}