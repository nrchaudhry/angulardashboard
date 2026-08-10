import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-employeementtype',
  templateUrl: './employeementtype.component.html',
  styleUrls: ['./employeementtype.component.css']
})
export class EmployeementtypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  employeementtypeID = null;

  employeementtypes = [];
  employeementtypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.employeementtypes = JSON.parse(window.sessionStorage.getItem('employeementtypes'));
    this.employeementtypesAll = JSON.parse(window.sessionStorage.getItem('employeementtypesAll'));
    if (this.disabled == false && this.employeementtypes == null) {
      this.employeementtypeGet();
    } else if (this.disabled == true && this.employeementtypesAll == null) {
      this.employeementtypeGetAll();
    }
  }

  setEmployeementtypes(response) {
    this.employeementtypes = response;
    window.sessionStorage.setItem("employeementtypes", JSON.stringify(this.employeementtypes));

    this.employeementtypesAll = response;
    window.sessionStorage.setItem("employeementtypesAll", JSON.stringify(this.employeementtypesAll));
  }

  employeementtypeGet() {
    this.lookupservice.lookup("EMPLOYEEMENTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setEmployeementtypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeementtypeGetAll() {
    this.lookupservice.lookupAll("EMPLOYEEMENTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setEmployeementtypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}