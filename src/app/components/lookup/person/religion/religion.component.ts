
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-religion',
  templateUrl: './religion.component.html',
  styleUrls: ['./religion.component.css']
})
export class ReligionComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  religionID = null;

  religions = [];
  religionsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.religions = JSON.parse(window.sessionStorage.getItem('religions'));
    this.religionsAll = JSON.parse(window.sessionStorage.getItem('religionsAll'));
    if (this.disabled == false && this.religions == null) {
      this.religionGet();
    } else if (this.disabled == true && this.religionsAll == null) {
      this.religionGetAll();
    }
  }

  setReligions(response) {
    if (this.disabled == false) {
      this.religions = response;
      window.sessionStorage.setItem("religions", JSON.stringify(this.religions));
    } else {
      this.religionsAll = response;
      window.sessionStorage.setItem("religionsAll", JSON.stringify(this.religionsAll));
    }
  }

  religionGet(){
    this.lookupservice.lookup("RELIGION").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReligions(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  religionGetAll(){
    this.lookupservice.lookupAll("RELIGION").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReligions(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}