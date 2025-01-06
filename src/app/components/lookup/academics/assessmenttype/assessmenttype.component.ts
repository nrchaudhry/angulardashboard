
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-assessmenttype',
  templateUrl: './assessmenttype.component.html',
  styleUrls: ['./assessmenttype.component.css']
})
export class AssessmenttypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  assessmenttypeID = null;

  assessmenttypes = [];
  assessmenttypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.assessmenttypes = JSON.parse(window.sessionStorage.getItem('assessmenttypes'));
    this.assessmenttypesAll = JSON.parse(window.sessionStorage.getItem('assessmenttypesAll'));
    if (this.disabled == false && this.assessmenttypes == null) {
      this.assessmenttypeGet();
    } else if (this.disabled == true && this.assessmenttypesAll == null) {
      this.assessmenttypeGetAll();
    }
  }

  setAssessmenttypes(response) {
    if (this.disabled == false) {
      this.assessmenttypes = response;
      window.sessionStorage.setItem("assessmenttypes", JSON.stringify(this.assessmenttypes));
    } else {
      this.assessmenttypesAll = response;
      window.sessionStorage.setItem("assessmenttypesAll", JSON.stringify(this.assessmenttypesAll));
    }
  }

  assessmenttypeGet(){
    this.lookupservice.lookup("ASSESSMENTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAssessmenttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  assessmenttypeGetAll(){
    this.lookupservice.lookupAll("ASSESSMENTTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAssessmenttypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}