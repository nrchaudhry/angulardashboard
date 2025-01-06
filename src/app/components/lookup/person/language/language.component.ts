
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  languageID = null;

  languages = [];
  languagesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.languages = JSON.parse(window.sessionStorage.getItem('languages'));
    this.languagesAll = JSON.parse(window.sessionStorage.getItem('languagesAll'));
    if (this.disabled == false && this.languages == null) {
      this.languageGet();
    } else if (this.disabled == true && this.languagesAll == null) {
      this.languageGetAll();
    }
  }

  setLanguages(response) {
    if (this.disabled == false) {
      this.languages = response;
      window.sessionStorage.setItem("languages", JSON.stringify(this.languages));
    } else {
      this.languagesAll = response;
      window.sessionStorage.setItem("languagesAll", JSON.stringify(this.languagesAll));
    }
  }

  languageGet(){
    this.lookupservice.lookup("LANGUAGE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLanguages(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  languageGetAll(){
    this.lookupservice.lookupAll("LANGUAGE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLanguages(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}