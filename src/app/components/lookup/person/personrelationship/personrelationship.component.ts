
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-personrelationship',
  templateUrl: './personrelationship.component.html',
  styleUrls: ['./personrelationship.component.css']
})
export class PersonrelationshipComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  personrelationshipID = null;

  personrelationships = [];
  personrelationshipsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.personrelationships = JSON.parse(window.sessionStorage.getItem('personrelationships'));
    this.personrelationshipsAll = JSON.parse(window.sessionStorage.getItem('personrelationshipsAll'));
    if (this.disabled == false && this.personrelationships == null) {
      this.personrelationshipGet();
    } else if (this.disabled == true && this.personrelationshipsAll == null) {
      this.personrelationshipGetAll();
    }
  }

  setPersonrelationships(response) {
    if (this.disabled == false) {
      this.personrelationships = response;
      window.sessionStorage.setItem("personrelationships", JSON.stringify(this.personrelationships));
    } else {
      this.personrelationshipsAll = response;
      window.sessionStorage.setItem("personrelationshipsAll", JSON.stringify(this.personrelationshipsAll));
    }
  }

  personrelationshipGet(){
    this.lookupservice.lookup("PERSONRELATIONSHIP").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPersonrelationships(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personrelationshipGetAll(){
    this.lookupservice.lookupAll("PERSONRELATIONSHIP").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setPersonrelationships(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}