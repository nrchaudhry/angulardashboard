import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonmembershipComponent } from '../../../../components/person/personmembership/personmembership.component';
import { PersonemploymentComponent } from 'src/app/components/person/personemployment/personemployment.component';

declare var $: any;

@Component({
  selector: 'app-personemploymentview',
  templateUrl: './personemploymentview.component.html',
  styleUrls: ['./personemploymentview.component.css']
})
export class PersonemploymentviewComponent implements OnInit {
  @ViewChild("personemployments") personemployments: PersonemploymentComponent;

  @ViewChild("addpersonmembership") addpersonmembership: PersonmembershipComponent;
  @ViewChild("editpersonmembership") editpersonmembership: PersonmembershipComponent;
  @ViewChild("personmembership") personmembership: PersonmembershipComponent;

  personemploymentID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.personemployment) {
        this.personemploymentID = params.personemployment;
      }
    });
  }

  refresh() {
    this.personemployments.load(true);
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/employments"], { queryParams: {} });
  }

  addNewPersonmembership() {
    this.addpersonmembership.add();
    $("#addpersonmembership").modal("show");
  }

  edit(row) {
    this.editpersonmembership.personmembership = {
      personmembership_ID: row.data.personmembership_ID,
      membershiptype_ID: row.data.membershiptype_ID,
      person_ID: row.data.person_ID,
      association_NAME: row.data.association_NAME,
      membership_SEQNO: row.data.membership_SEQNO,
      membership_GRADE: row.data.membership_GRADE,
      membership_NUMBER: row.data.membership_NUMBER,
      joined_DATE: row.data.joined_DATE,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersonmembership.personmembership.isactive = true;
    } else {
      this.editpersonmembership.personmembership.isactive = false;
    }
    $("#editpersonmembership").modal("show");
  }

  personmembershipcancel() {
    $("#addpersonmembership").modal("hide");
    $("#editpersonmembership").modal("hide");
  }

}
