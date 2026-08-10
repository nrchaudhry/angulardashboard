
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-documenttype',
  templateUrl: './documenttype.component.html',
  styleUrls: ['./documenttype.component.css']
})
export class DocumenttypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  documenttypeID = null;

  documenttypes = [];
  documenttypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.documenttypes = JSON.parse(window.sessionStorage.getItem('documenttypes'));
    this.documenttypesAll = JSON.parse(window.sessionStorage.getItem('documenttypesAll'));
    if (this.disabled == false && this.documenttypes == null) {
      this.documenttypeGet();
    } else if (this.disabled == true && this.documenttypesAll == null) {
      this.documenttypeGetAll();
    }
  }

  setDocumenttypes(response) {
    if (this.disabled == false) {
      this.documenttypes = response;
      window.sessionStorage.setItem("documenttypes", JSON.stringify(this.documenttypes));
    } else {
      this.documenttypesAll = response;
      window.sessionStorage.setItem("documenttypesAll", JSON.stringify(this.documenttypesAll));
    }
  }

  documenttypeGet(){
    this.lookupservice.lookup("DOCUMENTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setDocumenttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  documenttypeGetAll(){
    this.lookupservice.lookupAll("DOCUMENTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setDocumenttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}