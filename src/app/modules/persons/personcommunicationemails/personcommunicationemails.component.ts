import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PersoncommunicationemailComponent } from '../../../components/person/personcommunicationemail/personcommunicationemail.component'

declare var $: any;

@Component({
  selector: 'app-personcommunicationemails',
  templateUrl: './personcommunicationemails.component.html',
  styleUrls: ['./personcommunicationemails.component.css']
})
export class PersoncommunicationemailsComponent implements OnInit {
  @ViewChild("personcommunicationemails") personcommunicationemails: PersoncommunicationemailComponent;
  @ViewChild("addpersoncommunicationemail") addpersoncommunicationemail: PersoncommunicationemailComponent;
  @ViewChild("editpersoncommunicationemail") editpersoncommunicationemail: PersoncommunicationemailComponent;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  show(row) {
    this.router.navigate(["/home/emails"], { queryParams: {} });
  }

  addNew() {
    this.router.navigate(["/home/emails"], {});
  }

  refresh() {
    this.personcommunicationemails.load(true);
    this.cancel();
  }

  edit(row) {
    this.editpersoncommunicationemail.personcommunicationemail = {
      personemail_ID: row.data.personemail_ID,
      personcontact_ID: row.data.personcontact_ID,
      email_DATETIME: row.data.email_DATETIME,
      email_CONTENT: row.data.email_CONTENT,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersoncommunicationemail.personcommunicationemail.isactive = true;
    } else {
      this.editpersoncommunicationemail.personcommunicationemail.isactive = false;
    }
    $("#editpersoncommunicationemail").modal("show");
  }

  cancel() {
    $("#addpersoncommunicationemail").modal("hide");
    $("#editpersoncommunicationemail").modal("hide");
  }

}
