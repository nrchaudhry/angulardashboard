
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-immigrationstatus',
  templateUrl: './immigrationstatus.component.html',
  styleUrls: ['./immigrationstatus.component.css']
})
export class ImmigrationstatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  immigrationstatusID = null;

  immigrationstatuses = [];
  immigrationstatusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.immigrationstatuses = JSON.parse(window.sessionStorage.getItem('immigrationstatuses'));
    this.immigrationstatusesAll = JSON.parse(window.sessionStorage.getItem('immigrationstatusesAll'));
    if (this.disabled == false && this.immigrationstatuses == null) {
      this.immigrationstatusGet();
    } else if (this.disabled == true && this.immigrationstatusesAll == null) {
      this.immigrationstatusGetAll();
    }
  }

  setImmigrationstatuses(response) {
    if (this.disabled == false) {
      this.immigrationstatuses = response;
      window.sessionStorage.setItem("immigrationstatuses", JSON.stringify(this.immigrationstatuses));
    } else {
      this.immigrationstatusesAll = response;
      window.sessionStorage.setItem("immigrationstatusesAll", JSON.stringify(this.immigrationstatusesAll));
    }
  }

  immigrationstatusGet(){
    this.lookupservice.lookup("IMMIGRATIONSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setImmigrationstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  immigrationstatusGetAll(){
    this.lookupservice.lookupAll("IMMIGRATIONSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setImmigrationstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}