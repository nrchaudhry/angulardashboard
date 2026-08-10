import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PersoncommunicationletterComponent } from '../../../components/person/personcommunicationletter/personcommunicationletter.component'
import { PersoncommunicationemailComponent } from '../../../components/person/personcommunicationemail/personcommunicationemail.component'
import { PersoncommunicationsmsComponent } from '../../../components/person/personcommunicationsms/personcommunicationsms.component';

declare var $: any;

@Component({
  selector: 'app-personcommunications',
  templateUrl: './personcommunications.component.html',
  styleUrls: ['./personcommunications.component.css']
})
export class PersoncommunicationsComponent implements OnInit {
  @ViewChild("personcommunicationletters") personcommunicationletters: PersoncommunicationletterComponent;
  @ViewChild("personcommunicationemails") personcommunicationemails: PersoncommunicationemailComponent;
  @ViewChild("personcommunicationsmss") personcommunicationsmss: PersoncommunicationsmsComponent;

  personID = 0;
  personletterID = 0;
  personemailID = 0;
  personsmsID = 0;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  showLetter(row) {
    this.router.navigate(["/home/letter"], { queryParams: { personcommunicationletter: row.data.personletter_ID } });
  }

  addNewLetter() {
    this.router.navigate(["/home/letter"], {});
  }

  showEmail(row) {
    this.router.navigate(["/home/email"], { queryParams: { personcommunicationemail: row.data.personemail_ID } });
  }

  addNewEmail() {
    this.router.navigate(["/home/email"], {});
  }

  showSMS(row) {
    this.router.navigate(["/home/smss"], { queryParams: { personcommunicationsms: row.data.personsms_ID } });
  }

  addNewSMS() {
    this.router.navigate(["/home/smss"], {});
  }
}
