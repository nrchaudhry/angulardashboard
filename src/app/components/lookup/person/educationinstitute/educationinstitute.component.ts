
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-educationinstitute',
  templateUrl: './educationinstitute.component.html',
  styleUrls: ['./educationinstitute.component.css']
})
export class EducationinstituteComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  educationinstituteID = null;

  educationinstitutes = [];
  educationinstitutesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.educationinstitutes = JSON.parse(window.sessionStorage.getItem('educationinstitutes'));
    this.educationinstitutesAll = JSON.parse(window.sessionStorage.getItem('educationinstitutesAll'));
    if (this.disabled == false && this.educationinstitutes == null) {
      this.educationinstituteGet();
    } else if (this.disabled == true && this.educationinstitutesAll == null) {
      this.educationinstituteGetAll();
    }
  }

  setEducationinstitutes(response) {
    if (this.disabled == false) {
      this.educationinstitutes = response;
      window.sessionStorage.setItem("educationinstitutes", JSON.stringify(this.educationinstitutes));
    } else {
      this.educationinstitutesAll = response;
      window.sessionStorage.setItem("educationinstitutesAll", JSON.stringify(this.educationinstitutesAll));
    }
  }

  educationinstituteGet(){
    this.lookupservice.lookup("EDUCATIONINSTITUTE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEducationinstitutes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  educationinstituteGetAll(){
    this.lookupservice.lookupAll("EDUCATIONINSTITUTE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEducationinstitutes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}