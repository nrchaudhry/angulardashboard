
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-educationattendancemode',
  templateUrl: './educationattendancemode.component.html',
  styleUrls: ['./educationattendancemode.component.css']
})
export class EducationattendancemodeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  educationattendancemodeID = null;

  educationattendancemodes = [];
  educationattendancemodesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.educationattendancemodes = JSON.parse(window.sessionStorage.getItem('educationattendancemodes'));
    this.educationattendancemodesAll = JSON.parse(window.sessionStorage.getItem('educationattendancemodesAll'));
    if (this.disabled == false && this.educationattendancemodes == null) {
      this.educationattendancemodeGet();
    } else if (this.disabled == true && this.educationattendancemodesAll == null) {
      this.educationattendancemodeGetAll();
    }
  }

  setEducationattendancemodes(response) {
    if (this.disabled == false) {
      this.educationattendancemodes = response;
      window.sessionStorage.setItem("educationattendancemodes", JSON.stringify(this.educationattendancemodes));
    } else {
      this.educationattendancemodesAll = response;
      window.sessionStorage.setItem("educationattendancemodesAll", JSON.stringify(this.educationattendancemodesAll));
    }
  }

  educationattendancemodeGet(){
    this.lookupservice.lookup("EDUCATIONATTENDANCEMODE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEducationattendancemodes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  educationattendancemodeGetAll(){
    this.lookupservice.lookupAll("EDUCATIONATTENDANCEMODE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEducationattendancemodes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}