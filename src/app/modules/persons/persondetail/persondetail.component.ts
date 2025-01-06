import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { PersonComponent } from '../../../components/person/person/person.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonequalityComponent } from '../../../components/person/personequality/personequality.component';
import { PersonidentityComponent } from '../../../components/person/personidentity/personidentity.component';
import { PersoncontactComponent } from '../../../components/person/personcontact/personcontact.component';
import { PersoncontactaddressComponent } from '../../../components/person/personcontactaddress/personcontactaddress.component';

declare var $: any;

@Component({
  selector: 'app-persondetail',
  templateUrl: './persondetail.component.html',
  styleUrls: ['./persondetail.component.css']
})
export class PersondetailComponent implements OnInit {
  @ViewChild("person") person: PersonComponent;
  @ViewChild("personcontactaddresses") personcontactaddresses: PersoncontactaddressComponent;
  @ViewChild("personequalities") personequalities: PersonequalityComponent;

  @ViewChild("personcontacts") personcontacts: PersoncontactComponent;
  @ViewChild("addpersoncontact") addpersoncontact: PersoncontactComponent;
  @ViewChild("editpersoncontact") editpersoncontact: PersoncontactComponent;

  @ViewChild("personidentities") personidentities: PersonidentityComponent;
  @ViewChild("addpersonidentity") addpersonidentity: PersonidentityComponent;
  @ViewChild("editpersonidentity") editpersonidentity: PersonidentityComponent;

  personID = 0;
  personequalityID = 0;
  personcontactaddressID = 0;
  personcontactID = 0;
  personidentityID = 0;

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  disabled = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.person) {
        this.personID = params.person;
      } else if (window.sessionStorage.getItem('person') != null) {
        this.personID = Number(window.sessionStorage.getItem('person'));
      }
    });
  }

  personidentitiesrefresh() {
    this.personidentities.load(true);
    this.cancelidentity();
  }

  personcontactrefresh() {
    this.personcontacts.load(true);
    this.cancelcontact();
  }

  showcontactaddress(row) {
    this.router.navigate(["/home/contactaddressview"], { queryParams: { personcontactaddress: row.data.personcontactaddress_ID } });
  }

  addNewcontactaddress() {
    this.router.navigate(["/home/contactaddressview"], {});
    // this.addpersoncontactaddress.add();
    // $("#addpersoncontactaddress").modal("show");
  }

  showcontact(row) {
    this.router.navigate(["/home/contactview"], { queryParams: { personcontact: row.data.personcontact_ID } });
  }

  addNewcontact() {
    this.router.navigate(["/home/contactview"], {});
    // this.addpersoncontact.add();
    // $("#addpersoncontact").modal("show");
  }

  showidentity(row) {
    this.router.navigate(["/home/identityview"], { queryParams: { personidentity: row.data.personidentity_ID } });
  }

  addNewidentity() {
    this.router.navigate(["/home/identityview"], {});
    // this.addpersonidentity.add();
    // $("#addpersonidentity").modal("show");
  }

  editcontact(row) {
    this.editpersoncontact.personcontact = {
      personcontact_ID: row.data.personcontact_ID,
      person_ID: row.data.person_ID,
      contacttype_ID: row.data.contacttype_ID,
      contact_VALUE: row.data.contact_VALUE,
      ispreaferd: row.data.ispreaferd,
      isverified: row.data.isverified,
      isactive: row.data.isactive
    };
    if (row.data.ispreaferd == "Y") {
      this.editpersoncontact.personcontact.ispreaferd = true;
    } else {
      this.editpersoncontact.personcontact.ispreaferd = false;
    }
    if (row.data.isverified == "Y") {
      this.editpersoncontact.personcontact.isverified = true;
    } else {
      this.editpersoncontact.personcontact.isverified = false;
    }
    if (row.data.isactive == "Y") {
      this.editpersoncontact.personcontact.isactive = true;
    } else {
      this.editpersoncontact.personcontact.isactive = false;
    }
    $("#editpersoncontact").modal("show");
  }

  editidentity(row) {
    this.editpersonidentity.personidentity = {
      personidentity_ID: row.data.personidentity_ID,
      person_ID: row.data.person_ID,
      identity_NUMBER: row.data.identity_NUMBER,
      document_PATH: row.data.document_PATH,
      identitytype_ID: row.data.identitytype_ID,
      identity_DESC: row.data.identity_DESC,
      isactive: row.data.isactive
    }
    if (row.data.isactive == "Y") {
      this.editpersoncontact.personcontact.isactive = true;
    } else {
      this.editpersoncontact.personcontact.isactive = false;
    }
    $("#editpersonidentity").modal("show");
  }

  cancelcontactaddress() {
    $("#addpersoncontactaddress").modal("hide");
    $("#editpersoncontactaddress").modal("hide");
  }

  cancelcontact() {
    $("#addpersoncontact").modal("hide");
    $("#editpersoncontact").modal("hide");
  }

  cancelidentity() {
    $("#addpersonidentity").modal("hide");
    $("#editpersonidentity").modal("hide");
  }

  cancelEquality() {
    var search = {
      person_ID: this.personID
    }
    this.personequalities.personequalityAdvancedSearch(search);
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
