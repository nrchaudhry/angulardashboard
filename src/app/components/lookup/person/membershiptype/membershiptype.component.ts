
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-membershiptype',
  templateUrl: './membershiptype.component.html',
  styleUrls: ['./membershiptype.component.css']
})
export class MembershiptypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  membershiptypeID = null;

  membershiptypes = [];
  membershiptypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.membershiptypes = JSON.parse(window.sessionStorage.getItem('membershiptypes'));
    this.membershiptypesAll = JSON.parse(window.sessionStorage.getItem('membershiptypesAll'));
    if (this.disabled == false && this.membershiptypes == null) {
      this.membershiptypeGet();
    } else if (this.disabled == true && this.membershiptypesAll == null) {
      this.membershiptypeGetAll();
    }
  }

  setMembershiptypes(response) {
    if (this.disabled == false) {
      this.membershiptypes = response;
      window.sessionStorage.setItem("membershiptypes", JSON.stringify(this.membershiptypes));
    } else {
      this.membershiptypesAll = response;
      window.sessionStorage.setItem("membershiptypesAll", JSON.stringify(this.membershiptypesAll));
    }
  }

  membershiptypeGet() {
    this.lookupservice.lookup("MEMBERSHIP").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setMembershiptypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  membershiptypeGetAll() {
    this.lookupservice.lookupAll("MEMBERSHIPTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setMembershiptypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
