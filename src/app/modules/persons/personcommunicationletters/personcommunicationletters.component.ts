import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PersoncommunicationletterComponent } from '../../../components/person/personcommunicationletter/personcommunicationletter.component'

declare var $: any;

@Component({
  selector: 'app-personcommunicationletters',
  templateUrl: './personcommunicationletters.component.html',
  styleUrls: ['./personcommunicationletters.component.css']
})
export class PersoncommunicationlettersComponent implements OnInit {
  @ViewChild("personcommunicationletters") personcommunicationletters: PersoncommunicationletterComponent;
  @ViewChild("addpersoncommunicationletter") addpersoncommunicationletter: PersoncommunicationletterComponent;
  @ViewChild("editpersoncommunicationletter") editpersoncommunicationletter: PersoncommunicationletterComponent;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  show(row) {
    this.router.navigate(["/home/letter"], { queryParams: { personcommunicationletter: row.data.personletter_ID } });
  }

  addNew() {
    this.router.navigate(["/home/letter"], {});
  }

  refresh() {
    this.personcommunicationletters.load(true);
    this.cancel();
  }

  edit(row) {
    this.editpersoncommunicationletter.personcommunicationletter = {
      personletter_ID: row.data.personletter_ID,
      person_ID: row.data.person_ID,
      letter_DATE: row.data.letter_DATE,
      letter_CONTENT: row.data.letter_CONTENT,
      letter_REFNO: row.data.letter_REFNO,
      isletterapproved: row.data.isletterapproved,
      letter_ID: row.data.letter_ID,
      letter_REQUESTDATE: row.data.letter_REQUESTDATE,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersoncommunicationletter.personcommunicationletter.isactive = true;
    } else {
      this.editpersoncommunicationletter.personcommunicationletter.isactive = false;
    }
    $("#editpersoncommunicationletter").modal("show");
  }

  cancel() {
    $("#addpersoncommunicationletter").modal("hide");
    $("#editpersoncommunicationletter").modal("hide");
  }

}
