import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';

import { PersoncontactComponent } from '../../../components/person/personcontact/personcontact.component'
import { PersoncontactService } from '../../../components/person/personcontact/personcontact.service';

declare var $: any;

@Component({
  selector: 'app-personcontacts',
  templateUrl: './personcontacts.component.html',
  styleUrls: ['./personcontacts.component.css']
})
export class PersoncontactsComponent implements OnInit {
  @ViewChild("personcontacts") personcontacts: PersoncontactComponent;
  @ViewChild("addpersoncontact") addpersoncontact: PersoncontactComponent;
  @ViewChild("editpersoncontact") editpersoncontact: PersoncontactComponent;

  constructor(
    private accountclassificationservice: PersoncontactService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.personcontacts.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/personcontact"], { queryParams: { personcontact: row.data.personcontact_ID } });
  }

  addNew() {
    this.addpersoncontact.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editpersoncontact.personcontact = {
      personcontact_ID: row.data.personcontact_ID,
      person_ID: row.data.person_ID,
      contacttype_ID: row.data.contacttype_ID,
      contact_VALUE: row.data.contact_VALUE,
      ispreaferd: row.data.ispreaferd,
      isverified: row.data.isverified,
      isactive: row.data.isactive
    };
    if (row.data.ispreaferd == "Y") {
      this.editpersoncontact.personcontact.ispreaferd = true;
    } else {
      this.editpersoncontact.personcontact.ispreaferd = false;
    }
    if (row.data.isverified == "Y") {
      this.editpersoncontact.personcontact.isverified = true;
    } else {
      this.editpersoncontact.personcontact.isverified = false;
    }
    if (row.data.isactive == "Y") {
      this.editpersoncontact.personcontact.isactive = true;
    } else {
      this.editpersoncontact.personcontact.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
