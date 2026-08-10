
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-gradingsystem',
  templateUrl: './gradingsystem.component.html',
  styleUrls: ['./gradingsystem.component.css']
})
export class GradingsystemComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  gradingsystemID = null;

  gradingsystems = [];
  gradingsystemsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.gradingsystems = JSON.parse(window.sessionStorage.getItem('gradingsystems'));
    this.gradingsystemsAll = JSON.parse(window.sessionStorage.getItem('gradingsystemsAll'));
    if (this.disabled == false && this.gradingsystems == null) {
      this.gradingsystemGet();
    } else if (this.disabled == true && this.gradingsystemsAll == null) {
      this.gradingsystemGetAll();
    }
  }

  setGradingsystems(response) {
    if (this.disabled == false) {
      this.gradingsystems = response;
      window.sessionStorage.setItem("gradingsystems", JSON.stringify(this.gradingsystems));
    } else {
      this.gradingsystemsAll = response;
      window.sessionStorage.setItem("gradingsystemsAll", JSON.stringify(this.gradingsystemsAll));
    }
  }

  gradingsystemGet(){
    this.lookupservice.lookup("GRADINGSYSTEM").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setGradingsystems(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  gradingsystemGetAll(){
    this.lookupservice.lookupAll("GRADINGSYSTEM").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setGradingsystems(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}