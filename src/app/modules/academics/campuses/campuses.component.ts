import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { OnFailService } from '../../../services/on-fail.service';
import { CampusService } from './campus.service';

declare var $: any;


@Component({
  selector: 'app-campuses',
  templateUrl: './campuses.component.html',
  styleUrls: ['./campuses.component.css']
})
export class CampusesComponent implements OnInit {
  campusAll = [];

  constructor(
    private campusservice: CampusService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  view(row) {
    this.router.navigate(["/home/campus"], { queryParams: {campus: row.data.campus_ID}});
  }

  add() {
    this.router.navigate(["/home/campus"]);
  }

  edit(row) {
    this.router.navigate(["/home/campus"], { queryParams: {campus: row.data.campus_ID}});
  }

  // APIs Call Functions

  getAll() {
    this.campusservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          for (var a = 0; a < response.length; a++) {
            response[a].address = response[a].address_LINE1 + " " + response[a].address_LINE2 + " " + response[a].address_LINE3;
          }
          this.campusAll = response;
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}

