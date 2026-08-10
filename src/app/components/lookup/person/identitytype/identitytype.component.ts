
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-identitytype',
  templateUrl: './identitytype.component.html',
  styleUrls: ['./identitytype.component.css']
})
export class IdentitytypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  identitytypeID = null;

  identitytypes = [];
  identitytypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.identitytypes = JSON.parse(window.sessionStorage.getItem('identitytypes'));
    this.identitytypesAll = JSON.parse(window.sessionStorage.getItem('identitytypesAll'));
    if (this.disabled == false && this.identitytypes == null) {
      this.identitytypeGet();
    } else if (this.disabled == true && this.identitytypesAll == null) {
      this.identitytypeGetAll();
    }
  }

  setIdentitytypes(response) {
    if (this.disabled == false) {
      this.identitytypes = response;
      window.sessionStorage.setItem("identitytypes", JSON.stringify(this.identitytypes));
    } else {
      this.identitytypesAll = response;
      window.sessionStorage.setItem("identitytypesAll", JSON.stringify(this.identitytypesAll));
    }
  }

  identitytypeGet(){
    this.lookupservice.lookup("IDENTITYTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setIdentitytypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  identitytypeGetAll(){
    this.lookupservice.lookupAll("IDENTITYTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setIdentitytypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}