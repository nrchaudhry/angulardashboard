import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';

import { PersonidentityComponent } from '../../../components/person/personidentity/personidentity.component'
import { PersonidentityService } from '../../../components/person/personidentity/personidentity.service';

declare var $: any;

@Component({
  selector: 'app-personidentities',
  templateUrl: './personidentities.component.html',
  styleUrls: ['./personidentities.component.css']
})
export class PersonidentitiesComponent implements OnInit {
  @ViewChild("personidentities") personidentities: PersonidentityComponent;
  @ViewChild("addpersonidentity") addpersonidentity: PersonidentityComponent;
  @ViewChild("editpersonidentity") editpersonidentity: PersonidentityComponent;

  constructor(
    private personidentityservice: PersonidentityService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.personidentities.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/personidentity"], { queryParams: { personidentity: row.data.personidentity_ID } });
  }

  addNew() {
    this.addpersonidentity.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editpersonidentity.personidentity = {
      personidentity_ID: row.data.personidentity_ID,
      person_ID: row.data.person_ID,
      identity_NUMBER: row.data.identity_NUMBER,
      document_PATH: row.data.document_PATH,
      identitytype_ID: row.data.identitytype_ID,
      identity_DESC: row.data.identity_DESC,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editpersonidentity.personidentity.isactive = true;
    } else {
      this.editpersonidentity.personidentity.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
