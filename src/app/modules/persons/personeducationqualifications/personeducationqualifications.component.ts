import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { ActivatedRoute, Router } from '@angular/router';

import { PersoneducationqualificationComponent } from 'src/app/components/person/personeducationqualification/personeducationqualification.component';

declare var $: any;

@Component({
  selector: 'app-personeducationqualifications',
  templateUrl: './personeducationqualifications.component.html',
  styleUrls: ['./personeducationqualifications.component.css']
})
export class PersoneducationqualificationsComponent implements OnInit {
  @ViewChild("personeducationqualifications") personeducationqualifications: PersoneducationqualificationComponent;
  @ViewChild("addpersoneducationqualification") addpersoneducationqualification: PersoneducationqualificationComponent;
  @ViewChild("editpersoneducationqualification") editpersoneducationqualification: PersoneducationqualificationComponent;

  personID = 0;

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {}

  view() {
  }

  refresh() {
    this.personeducationqualifications.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/qualification"], { queryParams: { personeducationqualification: row.data.personqualification_ID } });
  }

  addNew() {
    this.router.navigate(["/home/qualification"], {});
    // this.addpersoneducationqualification.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editpersoneducationqualification.personeducationqualification = {
      personqualification_ID: row.data.personqualification_ID,
      person_ID: row.data.person_ID,
      institutecourse_ID: row.data.institutecourse_ID,
      total_MARKS: row.data.total_MARKS,
      registration_NUMBER: row.data.registration_NUMBER,
      dissertation_TITLE: row.data.dissertation_TITLE,
      obtained_MARKS: row.data.obtained_MARKS,
      obtained_PERCENTAGE: row.data.obtained_PERCENTAGE,
      educationattendancemode_ID: row.data.educationattendancemode_ID,
      educationsystem_ID: row.data.educationsystem_ID,
      qualification_STARTDATE: row.data.qualification_STARTDATE,
      qualification_ENDDATE: row.data.qualification_ENDDATE,
      qualificationstatus_ID: row.data.qualificationstatus_ID,
      gradingsystem_ID: row.data.gradingsystem_ID,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersoneducationqualification.personeducationqualification.isactive = true;
    } else {
      this.editpersoneducationqualification.personeducationqualification.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
