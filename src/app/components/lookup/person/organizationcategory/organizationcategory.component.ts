import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-organizationcategory',
  templateUrl: './organizationcategory.component.html',
  styleUrls: ['./organizationcategory.component.css']
})
export class OrganizationcategoryComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  organizationcategoryID = null;

  organizationcategories = [];
  organizationcategoriesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.organizationcategories = JSON.parse(window.sessionStorage.getItem('organizationcategories'));
    this.organizationcategoriesAll = JSON.parse(window.sessionStorage.getItem('organizationcategoriesAll'));
    if (this.organizationcategories == null) {
      this.organizationcategoryGet();
    } 

if (this.organizationcategoriesAll == null) {
      this.organizationcategoryGetAll();
    }
  }

  setOrganizationcategories(response) {
      this.organizationcategories = response;
      window.sessionStorage.setItem("organizationcategories", JSON.stringify(this.organizationcategories));
    
      this.organizationcategoriesAll = response;
      window.sessionStorage.setItem("organizationcategoriesAll", JSON.stringify(this.organizationcategoriesAll));
    }

  organizationcategoryGet(){
    this.lookupservice.lookup("ORGANIZATIONCATEGORY").subscribe(response => {
      if (response) {
        if (response.error && response.tutortype) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setOrganizationcategories(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationcategoryGetAll(){
    this.lookupservice.lookupAll("ORGANIZATIONCATEGORY").subscribe(response => {
      if (response) {
        if (response.error && response.tutortype) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setOrganizationcategories(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}