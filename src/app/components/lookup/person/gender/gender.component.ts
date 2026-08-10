
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.css']
})
export class GenderComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  genderID = null;

  genders = [];
  gendersAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.genders = JSON.parse(window.sessionStorage.getItem('genders'));
    this.gendersAll = JSON.parse(window.sessionStorage.getItem('gendersAll'));
    if (this.disabled == false && this.genders == null) {
      this.genderGet();
    } else if (this.disabled == true && this.gendersAll == null) {
      this.genderGetAll();
    }
  }

  setGenders(response) {
    if (this.disabled == false) {
      this.genders = response;
      window.sessionStorage.setItem("genders", JSON.stringify(this.genders));
    } else {
      this.gendersAll = response;
      window.sessionStorage.setItem("gendersAll", JSON.stringify(this.gendersAll));
    }
  }

  genderGet(){
    this.lookupservice.lookup("GENDER").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setGenders(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  genderGetAll(){
    this.lookupservice.lookupAll("GENDER").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setGenders(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}