import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-employeemoduletype',
  templateUrl: './employeemoduletype.component.html',
  styleUrls: ['./employeemoduletype.component.css']
})
export class EmployeemoduletypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  employeemoduletypeID = null;

  employeemoduletypes = [];
  employeemoduletypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.employeemoduletypes = JSON.parse(window.sessionStorage.getItem('employeemoduletypes'));
    this.employeemoduletypesAll = JSON.parse(window.sessionStorage.getItem('employeemoduletypesAll'));
    if (this.disabled == false && this.employeemoduletypes == null) {
      this.employeemoduletypeGet();
    } else if (this.disabled == true && this.employeemoduletypesAll == null) {
      this.employeemoduletypeGetAll();
    }
  }

  setEmployeemoduletypes(response) {
    this.employeemoduletypes = response;
    window.sessionStorage.setItem("employeemoduletypes", JSON.stringify(this.employeemoduletypes));

    this.employeemoduletypesAll = response;
    window.sessionStorage.setItem("employeemoduletypesAll", JSON.stringify(this.employeemoduletypesAll));
  }

  employeemoduletypeGet() {
    this.lookupservice.lookup("EMPLOYEEMODULETPYE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setEmployeemoduletypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  employeemoduletypeGetAll() {
    this.lookupservice.lookupAll("EMPLOYEEMODULETPYE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setEmployeemoduletypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}