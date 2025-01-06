
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PersonComponent } from '../../components/person/person/person.component';

declare var $: any;

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {
  @ViewChild("persons") persons: PersonComponent;
  @ViewChild("addperson") addperson: PersonComponent;
  @ViewChild("editperson") editperson: PersonComponent;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view(row) {
    this.router.navigate(["/home/person"], { queryParams: { person: row.data.person_ID } });
  }

  addNew() {
    this.router.navigate(["/home/person"], {});
  }

  refresh() {
    this.persons.load(true);
    this.cancel();
  }

  //   edit(row) {
  //     this.editperson.person = {
  //       person_ID: row.data.person_ID,
  //       person_NAME: row.data.person_NAME,
  //       person_DESC: row.data.person_DESC,
  //       person_IMAGE: row.data.person_IMAGE,
  //       application_ID: row.data.application_ID,
  //       product_ID: row.data.product_ID,
  //       isactive: row.data.isactive
  //     };
  //     if (row.data.isactive=="Y") {
  //       this.editperson.person.isactive = true;
  //     } else {
  //       this.editperson.person.isactive = false;
  //     }
  //     $("#editperson").modal("show");
  //   }

  cancel() {
    $("#addperson").modal("hide");
    $("#editperson").modal("hide");
  }
}

