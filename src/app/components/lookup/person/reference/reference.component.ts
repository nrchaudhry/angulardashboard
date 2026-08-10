
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  referenceID = null;

  references = [];
  referencesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.references = JSON.parse(window.sessionStorage.getItem('references'));
    this.referencesAll = JSON.parse(window.sessionStorage.getItem('referencesAll'));
    if (this.disabled == false && this.references == null) {
      this.referenceGet();
    } else if (this.disabled == true && this.referencesAll == null) {
      this.referenceGetAll();
    }
  }

  setReferences(response) {
    if (this.disabled == false) {
      this.references = response;
      window.sessionStorage.setItem("references", JSON.stringify(this.references));
    } else {
      this.referencesAll = response;
      window.sessionStorage.setItem("referencesAll", JSON.stringify(this.referencesAll));
    }
  }

  referenceGet(){
    this.lookupservice.lookup("REFERENCE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReferences(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referenceGetAll(){
    this.lookupservice.lookupAll("REFERENCE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReferences(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}