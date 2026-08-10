
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-competency',
  templateUrl: './competency.component.html',
  styleUrls: ['./competency.component.css']
})
export class CompetencyComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  competencyID = null;

  competencies = [];
  competenciesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.competencies = JSON.parse(window.sessionStorage.getItem('competencies'));
    this.competenciesAll = JSON.parse(window.sessionStorage.getItem('competenciesAll'));
    if (this.disabled == false && this.competencies == null) {
      this.competencyGet();
    } else if (this.disabled == true && this.competenciesAll == null) {
      this.competencyGetAll();
    }
  }

  setCompetencies(response) {
    if (this.disabled == false) {
      this.competencies = response;
      window.sessionStorage.setItem("competencies", JSON.stringify(this.competencies));
    } else {
      this.competenciesAll = response;
      window.sessionStorage.setItem("competenciesAll", JSON.stringify(this.competenciesAll));
    }
  }

  competencyGet(){
    this.lookupservice.lookup("COMPETENCY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCompetencies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  competencyGetAll(){
    this.lookupservice.lookupAll("COMPETENCY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCompetencies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}