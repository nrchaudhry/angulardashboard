import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonemploymentComponent } from 'src/app/components/person/personemployment/personemployment.component';

declare var $: any;

@Component({
  selector: 'app-personemployments',
  templateUrl: './personemployments.component.html',
  styleUrls: ['./personemployments.component.css']
})
export class PersonemploymentsComponent implements OnInit {
  @ViewChild("personemployments") personemployments: PersonemploymentComponent;
  @ViewChild("addpersonemployment") addpersonemployment: PersonemploymentComponent;
  @ViewChild("editpersonemployment") editpersonemployment: PersonemploymentComponent;

  personID = 0;

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  view() {
  }

  refresh() {
    this.personemployments.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/employment"], { queryParams: { personemployment: row.data.personemployment_ID } });
  }

  addNew() {
    this.router.navigate(["/home/employment"], {});
    // this.addpersonemployment.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editpersonemployment.personemployment = {
      personemployment_ID: row.data.personemployment_ID,
      employer_NAME: row.data.employer_NAME,
      location_ID: row.data.location_ID,
      locations: [],
      person_ID: row.data.person_ID,
      job_DESCRIPTION: row.data.job_DESCRIPTION,
      startdate: row.data.startdate,
      enddate: row.data.enddate,
      worktype_ID: row.data.worktype_ID,
      address_LINE1: row.data.address_LINE1,
      address_LINE2: row.data.address_LINE2,
      address_LINE3: row.data.address_LINE3,
      address_LINE4: row.data.address_LINE4,
      address_LINE5: row.data.address_LINE5,
      address_POSTCODE: row.data.address_POSTCODE,
      contact_NUMBER: row.data.contact_NUMBER,
      office_EMAIL: row.data.office_EMAIL,
      website: row.data.website,
      workfield_ID: row.data.workfield_ID,
      careerlevel_ID: row.data.careerlevel_ID,
      organizationtype_ID: row.data.organizationtype_ID,
      organizationsector_ID: row.data.organizationsector_ID,
      organizationcategory_ID: row.data.organizationcategory_ID,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersonemployment.personemployment.isactive = true;
    } else {
      this.editpersonemployment.personemployment.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
