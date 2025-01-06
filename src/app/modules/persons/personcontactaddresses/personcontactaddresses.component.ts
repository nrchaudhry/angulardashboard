import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { Router } from '@angular/router';
import { PersoncontactaddressComponent } from '../../../components/person/personcontactaddress/personcontactaddress.component'
import { PersoncontactaddressService } from '../../../components/person/personcontactaddress/personcontactaddress.service';

declare var $: any;

@Component({
  selector: 'app-personcontactaddresses',
  templateUrl: './personcontactaddresses.component.html',
  styleUrls: ['./personcontactaddresses.component.css']
})
export class PersoncontactaddressesComponent implements OnInit {
  @ViewChild("personcontactaddresses") personcontactaddresses: PersoncontactaddressComponent;
  @ViewChild("addpersoncontactaddress") addpersoncontactaddress: PersoncontactaddressComponent;
  @ViewChild("editpersoncontactaddress") editpersoncontactaddress: PersoncontactaddressComponent;

  constructor(
    private accountclassificationservice: PersoncontactaddressService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.personcontactaddresses.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/personcontactaddress"], { queryParams: { personcontactaddress: row.data.personcontactaddress_ID } });
  }

  addNew() {
    this.addpersoncontactaddress.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editpersoncontactaddress.personcontactaddress = {
      personcontactaddress_ID: row.data.personcontactaddress_ID,
      person_ID: row.data.person_ID,
      address_LINE1: row.data.address_LINE1,
      address_LINE2: row.data.address_LINE2,
      address_LINE3: row.data.address_LINE3,
      address_LINE4: row.data.address_LINE4,
      address_LINE5: row.data.address_LINE5,
      address_POSTCODE: row.data.address_POSTCODE,
      location_ID: row.data.location_ID,
      ispermanent: row.data.ispermanent,
      isactive: row.data.isactive
    };

    if (row.data.isactive == "Y") {
      this.editpersoncontactaddress.personcontactaddress.isactive = true;
    } else {
      this.editpersoncontactaddress.personcontactaddress.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
