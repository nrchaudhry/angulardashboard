import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PersonlanguageComponent } from '../../../components/person/personlanguage/personlanguage.component'
import { PersonlanguageService } from '../../../components/person/personlanguage/personlanguage.service';

declare var $: any;

@Component({
  selector: 'app-personlanguages',
  templateUrl: './personlanguages.component.html',
  styleUrls: ['./personlanguages.component.css']
})
export class PersonlanguagesComponent implements OnInit {
  @ViewChild("personlanguages") personlanguages: PersonlanguageComponent;
  @ViewChild("addpersonlanguage") addpersonlanguage: PersonlanguageComponent;
  @ViewChild("editpersonlanguage") editpersonlanguage: PersonlanguageComponent;

  constructor(
    private personlanguageservice: PersonlanguageService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addpersonlanguage.add();
    $("#addpersonlanguage").modal("show");
  }

  refresh() {
    this.personlanguages.load(true);
    this.cancel();
  }

  edit(row) {
    this.editpersonlanguage.personlanguage = {
      personlanguage_ID: row.data.personlanguage_ID,
      person_ID: row.data.person_ID,
      person_DETAIL: row.data.person_DETAIL,
      language_ID: row.data.language_ID,
      fluency_ID: row.data.fluency_ID,
      competency_ID: row.data.competency_ID,
      comments: row.data.comments,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersonlanguage.personlanguage.isactive = true;
    } else {
      this.editpersonlanguage.personlanguage.isactive = false;
    }
    $("#editpersonlanguage").modal("show");
  }

  cancel() {
    $("#addpersonlanguage").modal("hide");
    $("#editpersonlanguage").modal("hide");
  }

}
