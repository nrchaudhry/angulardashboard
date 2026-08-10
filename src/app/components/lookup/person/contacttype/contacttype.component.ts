
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-contacttype',
  templateUrl: './contacttype.component.html',
  styleUrls: ['./contacttype.component.css']
})
export class ContacttypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  contacttypeID = null;

  contacttypes = [];
  contacttypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.contacttypes = JSON.parse(window.sessionStorage.getItem('contacttypes'));
    this.contacttypesAll = JSON.parse(window.sessionStorage.getItem('contacttypesAll'));
    if (this.contacttypes == null) {
      this.ContacttypeGet();
    } 

if (this.contacttypesAll == null) {
      this.ContacttypeGetAll();
    }
  }

  setContacttypes(response) {
    if (this.disabled == false) {
      this.contacttypes = response;
      window.sessionStorage.setItem("contacttypes", JSON.stringify(this.contacttypes));
    } else {
      this.contacttypesAll = response;
      window.sessionStorage.setItem("contacttypesAll", JSON.stringify(this.contacttypesAll));
    }
  }

  ContacttypeGet(){
    this.lookupservice.lookup("CONTACTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setContacttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ContacttypeGetAll(){
    this.lookupservice.lookupAll("CONTACTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setContacttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}