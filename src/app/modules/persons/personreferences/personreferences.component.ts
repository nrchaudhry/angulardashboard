import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PersonreferenceComponent } from '../../../components/person/personreference/personreference.component'
import { PersonreferenceService } from '../../../components/person/personreference/personreference.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-personreferences',
  templateUrl: './personreferences.component.html',
  styleUrls: ['./personreferences.component.css']
})
export class PersonreferencesComponent implements OnInit {
  @ViewChild("personreferences") personreferences: PersonreferenceComponent;
  @ViewChild("addpersonreference") addpersonreference: PersonreferenceComponent;
  @ViewChild("editpersonreference") editpersonreference: PersonreferenceComponent;

  constructor(
    private personcontactservice: PersonreferenceService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  show(row) {
    this.router.navigate(["/home/reference"], { queryParams: { personreference: row.data.personreference_ID } });
  }

  addNew() {
    this.router.navigate(["/home/reference"], {});
  }

  refresh() {
    this.personreferences.load(true);
    this.cancel();
  }

  edit(row) {
    this.editpersonreference.personreference = {
      personreference_ID: row.data.personreference_ID,
      personrelationship_ID: row.data.personrelationship_ID,
      referenceperson_ID: row.data.referenceperson_ID,
      person_ID: row.data.person_ID,
      iscontact: row.data.iscontact,
      iskininfo: row.data.iskininfo,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersonreference.personreference.isactive = true;
    } else {
      this.editpersonreference.personreference.isactive = false;
    }
    $("#editpersonreference").modal("show");
  }

  cancel() {
    $("#addpersonreference").modal("hide");
    $("#editpersonreference").modal("hide");
  }

}
