import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PersonequalityComponent } from '../../../components/person/personequality/personequality.component'
import { PersonequalityService } from '../../../components/person/personequality/personequality.service';
import { RouterLinkWithHref } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-personequalities',
  templateUrl: './personequalities.component.html',
  styleUrls: ['./personequalities.component.css']
})
export class PersonequalitiesComponent implements OnInit {
  @ViewChild("personequalities") personequalities: PersonequalityComponent;
  @ViewChild("addpersonequality") addpersonequality: PersonequalityComponent;
  @ViewChild("editpersonequality") editpersonequality: PersonequalityComponent;

  constructor(
    private personequalitieservice: PersonequalityService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addpersonequality.add();
    $("#add").modal("show");
  }

  refresh() {
    this.personequalities.load(true);
    this.cancel();
  }

  edit(row) {
    this.editpersonequality.personequality = {
      personequality_ID: row.data.personequality_ID,
      person_DETAIL: row.data.person_DETAIL,
      sex_ID: row.data.sex_ID,
      person_ID: row.data.person_ID,
      ethnic_ID: row.data.ethnic_ID,
      gender_ID: row.data.gender_ID,
      domicile_ID: row.data.domicile_ID,
      religion_ID: row.data.religion_ID,
      nationality_ID: row.data.nationality_ID,
      nationalities: [],
      residentials: [],
      domiciles: [],
      maritalstatus_ID: row.data.maritalstatus_ID,
      sex_DESC: row.data.sex_DESC,
      sexualorientation_DESC: row.data.sexualorientation_DESC,
      sexualorientation_ID: row.data.sexualorientation_ID,
      immigrationstatus_ID: row.data.immigrationstatus_ID,
      immigrationstatus_DESC: row.data.immigrationstatus_DESC,
      armedforcesindicator_ID: row.data.armedforcesindicator_ID,
      armedforcesindicator_DESC: row.data.armedforcesindicator_DESC,
      disable_ID: row.data.disable_ID,
      residential_ID: row.data.residential_ID,
      lookedafterchildindicator_ID: row.data.lookedafterchildindicator_ID,
      convictiondetails: row.data.convictiondetails,
      date_OF_UK_ENTRY: row.data.date_OF_UK_ENTRY,
      iscriminalconviction: row.data.iscriminalconviction,
      issmoker: row.data.issmoker,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersonequality.personequality.isactive = true;
    } else {
      this.editpersonequality.personequality.isactive = false;
    }
    $("#edit").modal("show");
  }
  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
