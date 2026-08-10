
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-organizationsector',
  templateUrl: './organizationsector.component.html',
  styleUrls: ['./organizationsector.component.css']
})
export class OrganizationsectorComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  organizationsectorID = null;

  organizationsectors = [];
  organizationsectorsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.organizationsectors = JSON.parse(window.sessionStorage.getItem('organizationsectors'));
    this.organizationsectorsAll = JSON.parse(window.sessionStorage.getItem('organizationsectorsAll'));
    if (this.disabled == false && this.organizationsectors == null) {
      this.organizationsectorGet();
    } else if (this.disabled == true && this.organizationsectorsAll == null) {
      this.organizationsectorGetAll();
    }
  }

  setOrganizationsectors(response) {
    if (this.disabled == false) {
      this.organizationsectors = response;
      window.sessionStorage.setItem("organizationsectors", JSON.stringify(this.organizationsectors));
    } else {
      this.organizationsectorsAll = response;
      window.sessionStorage.setItem("organizationsectorsAll", JSON.stringify(this.organizationsectorsAll));
    }
  }

  organizationsectorGet(){
    this.lookupservice.lookup("ORGANIZATIONSECTOR").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setOrganizationsectors(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationsectorGetAll(){
    this.lookupservice.lookupAll("ORGANIZATIONSECTOR").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setOrganizationsectors(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}