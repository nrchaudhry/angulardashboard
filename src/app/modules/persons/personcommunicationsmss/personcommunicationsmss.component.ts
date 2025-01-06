import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PersoncommunicationsmsComponent } from '../../../components/person/personcommunicationsms/personcommunicationsms.component'

declare var $: any;

@Component({
  selector: 'app-personcommunicationsmss',
  templateUrl: './personcommunicationsmss.component.html',
  styleUrls: ['./personcommunicationsmss.component.css']
})
export class PersoncommunicationsmssComponent implements OnInit {
  @ViewChild("personcommunicationsmss") personcommunicationsmss: PersoncommunicationsmsComponent;
  @ViewChild("addpersoncommunicationsms") addpersoncommunicationsms: PersoncommunicationsmsComponent;
  @ViewChild("editpersoncommunicationsms") editpersoncommunicationsms: PersoncommunicationsmsComponent;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  show(row) {
    this.router.navigate(["/home/smss"], { queryParams: {} });
  }

  addNew() {
    this.router.navigate(["/home/smss"], {});
  }

  refresh() {
    this.personcommunicationsmss.load(true);
    this.cancel();
  }

  edit(row) {
    this.editpersoncommunicationsms.personcommunicationsms = {
      personsms_ID: row.data.personsms_ID,
      personcontact_ID: row.data.personcontact_ID,
      sms_DATETIME: row.data.sms_DATETIME,
      sms_CONTENT: row.data.sms_CONTENT,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersoncommunicationsms.personcommunicationsms.isactive = true;
    } else {
      this.editpersoncommunicationsms.personcommunicationsms.isactive = false;
    }
    $("#editpersoncommunicationsms").modal("show");
  }

  cancel() {
    $("#addpersoncommunicationsms").modal("hide");
    $("#editpersoncommunicationsms").modal("hide");
  }

}
