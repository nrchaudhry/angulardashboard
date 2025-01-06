import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PersoneducationinstituteComponent } from '../../../components/person/personeducationinstitute/personeducationinstitute.component'
import { PersoneducationinstituteService } from '../../../components/person/personeducationinstitute/personeducationinstitute.service';

declare var $: any;

@Component({
  selector: 'app-personeducationinstitutes',
  templateUrl: './personeducationinstitutes.component.html',
  styleUrls: ['./personeducationinstitutes.component.css']
})
export class PersoneducationinstitutesComponent implements OnInit {
  @ViewChild("personeducationinstitutes") personeducationinstitutes: PersoneducationinstituteComponent;
  @ViewChild("addpersoneducationinstitute") addpersoneducationinstitute: PersoneducationinstituteComponent;
  @ViewChild("editpersoneducationinstitute") editpersoneducationinstitute: PersoneducationinstituteComponent;

  constructor(
    private personeducationinstituteservice: PersoneducationinstituteService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addpersoneducationinstitute.add();
    $("#addpersoneducationinstitute").modal("show");
  }

  refresh() {
    this.personeducationinstitutes.load(true);
    this.cancel();
  }

  edit(row) {
    this.editpersoneducationinstitute.personeducationinstitute = {
      personinstitute_ID: row.data.personinstitute_ID,
      personinstitute_ENDDATE: row.data.personinstitute_ENDDATE,
      personinstitute_STARTDATE: row.data.personinstitute_STARTDATE,
      educationinstitute_DESC: row.data.educationinstitute_DESC,
      educationinstitute_ID: row.data.educationinstitute_ID,
      educationattendancemode_ID: row.data.educationattendancemode_ID,
      person_ID: row.data.person_ID,
      recievedqualification: row.data.recievedqualification,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersoneducationinstitute.personeducationinstitute.isactive = true;
    } else {
      this.editpersoneducationinstitute.personeducationinstitute.isactive = false;
    }
    $("#editpersoneducationinstitute").modal("show");
  }

  cancel() {
    $("#addpersoneducationinstitute").modal("hide");
    $("#editpersoneducationinstitute").modal("hide");
  }

}
