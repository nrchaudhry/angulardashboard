import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-memebershiptype',
  templateUrl: './memebershiptype.component.html',
  styleUrls: ['./memebershiptype.component.css']
})
export class MemebershiptypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  memebershiptypeID = null;

  memebershiptypes = [];
  memebershiptypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.memebershiptypes = JSON.parse(window.sessionStorage.getItem('memebershiptypes'));
    this.memebershiptypesAll = JSON.parse(window.sessionStorage.getItem('memebershiptypesAll'));
    if (this.memebershiptypes == null) {
      this.memebershiptypeGet();
    } 

if (this.memebershiptypesAll == null) {
      this.memebershiptypeGetAll();
    }
  }

  setMemebershiptypes(response) {
      this.memebershiptypes = response;
      window.sessionStorage.setItem("memebershiptypes", JSON.stringify(this.memebershiptypes));
   
      this.memebershiptypesAll = response;
      window.sessionStorage.setItem("memebershiptypesAll", JSON.stringify(this.memebershiptypesAll));
    }

  memebershiptypeGet(){
    this.lookupservice.lookup("MEMEBERSHIPTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setMemebershiptypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  memebershiptypeGetAll(){
    this.lookupservice.lookupAll("MEMEBERSHIPTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setMemebershiptypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}