
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-qualificationstatus',
  templateUrl: './qualificationstatus.component.html',
  styleUrls: ['./qualificationstatus.component.css']
})
export class QualificationstatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  qualificationstatusID = null;

  qualificationstatuses = [];
  qualificationstatusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.qualificationstatuses = JSON.parse(window.sessionStorage.getItem('qualificationstatuses'));
    this.qualificationstatusesAll = JSON.parse(window.sessionStorage.getItem('qualificationstatusesAll'));
    if (this.disabled == false && this.qualificationstatuses == null) {
      this.qualificationstatusGet();
    } else if (this.disabled == true && this.qualificationstatusesAll == null) {
      this.qualificationstatusGetAll();
    }
  }

  setQualificationstatuses(response) {
    if (this.disabled == false) {
      this.qualificationstatuses = response;
      window.sessionStorage.setItem("qualificationstatuses", JSON.stringify(this.qualificationstatuses));
    } else {
      this.qualificationstatusesAll = response;
      window.sessionStorage.setItem("qualificationstatusesAll", JSON.stringify(this.qualificationstatusesAll));
    }
  }

  qualificationstatusGet(){
    this.lookupservice.lookup("QUALIFICATIONSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setQualificationstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationstatusGetAll(){
    this.lookupservice.lookupAll("QUALIFICATIONSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setQualificationstatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}