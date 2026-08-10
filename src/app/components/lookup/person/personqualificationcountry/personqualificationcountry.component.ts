
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-personqualificationcountry',
  templateUrl: './personqualificationcountry.component.html',
  styleUrls: ['./personqualificationcountry.component.css']
})
export class PersonqualificationcountryComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  personqualificationcountryID = null;

  personqualificationcountries = [];
  personqualificationcountriesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.personqualificationcountries = JSON.parse(window.sessionStorage.getItem('personqualificationcountries'));
    this.personqualificationcountriesAll = JSON.parse(window.sessionStorage.getItem('personqualificationcountriesAll'));
    if (this.disabled == false && this.personqualificationcountries == null) {
      this.personqualificationcountryGet();
    } else if (this.disabled == true && this.personqualificationcountriesAll == null) {
      this.personqualificationcountryGetAll();
    }
  }

  setPersonqualificationcountries(response) {
    if (this.disabled == false) {
      this.personqualificationcountries = response;
      window.sessionStorage.setItem("personqualificationcountries", JSON.stringify(this.personqualificationcountries));
    } else {
      this.personqualificationcountriesAll = response;
      window.sessionStorage.setItem("personqualificationcountriesAll", JSON.stringify(this.personqualificationcountriesAll));
    }
  }

  personqualificationcountryGet(){
    this.lookupservice.lookup("PERSONQUALIFICATIONCOUNTRY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPersonqualificationcountries(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personqualificationcountryGetAll(){
    this.lookupservice.lookupAll("PERSONQUALIFICATIONCOUNTRY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPersonqualificationcountries(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}