
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-educationsystem',
  templateUrl: './educationsystem.component.html',
  styleUrls: ['./educationsystem.component.css']
})
export class EducationsystemComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  educationsystemID = null;

  educationsystems = [];
  educationsystemsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.educationsystems = JSON.parse(window.sessionStorage.getItem('educationsystems'));
    this.educationsystemsAll = JSON.parse(window.sessionStorage.getItem('educationsystemsAll'));
    if (this.disabled == false && this.educationsystems == null) {
      this.educationsystemGet();
    } else if (this.disabled == true && this.educationsystemsAll == null) {
      this.educationsystemGetAll();
    }
  }

  setEducationsystems(response) {
    if (this.disabled == false) {
      this.educationsystems = response;
      window.sessionStorage.setItem("educationsystems", JSON.stringify(this.educationsystems));
    } else {
      this.educationsystemsAll = response;
      window.sessionStorage.setItem("educationsystemsAll", JSON.stringify(this.educationsystemsAll));
    }
  }

  educationsystemGet(){
    this.lookupservice.lookup("EDUCATIONSYSTEM").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEducationsystems(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  educationsystemGetAll(){
    this.lookupservice.lookupAll("EDUCATIONSYSTEM").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEducationsystems(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}