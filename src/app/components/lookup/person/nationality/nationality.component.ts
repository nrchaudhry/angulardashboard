
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.css']
})
export class NationalityComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  nationalityID = null;

  nationalities = [];
  nationalitiesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.nationalities = JSON.parse(window.sessionStorage.getItem('nationalities'));
    this.nationalitiesAll = JSON.parse(window.sessionStorage.getItem('nationalitiesAll'));
    if (this.disabled == false && this.nationalities == null) {
      this.nationalityGet();
    } else if (this.disabled == true && this.nationalitiesAll == null) {
      this.nationalityGetAll();
    }
  }

  setnationalities(response) {
    if (this.disabled == false) {
      this.nationalities = response;
      window.sessionStorage.setItem("nationalities", JSON.stringify(this.nationalities));
    } else {
      this.nationalitiesAll = response;
      window.sessionStorage.setItem("nationalitiesAll", JSON.stringify(this.nationalitiesAll));
    }
  }

  nationalityGet() {
    this.lookupservice.lookup("NATIONALITY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setnationalities(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  nationalityGetAll() {
    this.lookupservice.lookupAll("NATIONALITY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setnationalities(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
