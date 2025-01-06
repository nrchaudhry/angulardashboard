import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-leavetype',
  templateUrl: './leavetype.component.html',
  styleUrls: ['./leavetype.component.css']
})
export class LeavetypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  leavetypeID = null;

  leavetypes = [];
  leavetypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.leavetypes = JSON.parse(window.sessionStorage.getItem('leavetypes'));
    this.leavetypesAll = JSON.parse(window.sessionStorage.getItem('leavetypesAll'));
    if (this.disabled == false && this.leavetypes == null) {
      this.leavetypeGet();
    } else if (this.disabled == true && this.leavetypesAll == null) {
      this.leavetypeGetAll();
    }
  }

  setLeavetypes(response) {
    this.leavetypes = response;
    window.sessionStorage.setItem("leavetypes", JSON.stringify(this.leavetypes));

    this.leavetypesAll = response;
    window.sessionStorage.setItem("leavetypesAll", JSON.stringify(this.leavetypesAll));
  }

  leavetypeGet() {
    this.lookupservice.lookup("LEAVETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLeavetypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  leavetypeGetAll() {
    this.lookupservice.lookupAll("LEAVETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLeavetypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}