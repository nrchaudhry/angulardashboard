import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { setting } from 'src/app/setting';
import { redirectByHref } from '../../../utilities/Shared_Funtions';
import { OnFailService } from '../../../services/on-fail.service';

import { PersonmembershipService } from './personmembership.service';
import { PersonComponent } from '../person/person.component';
import { MembershiptypeComponent } from '../../lookup/person/membershiptype/membershiptype.component';

@Component({
  selector: 'app-personmembership',
  templateUrl: './personmembership.component.html',
  styleUrls: ['./personmembership.component.css']
})
export class PersonmembershipComponent implements OnInit {
  @ViewChild("membershiptype") membershiptype: MembershiptypeComponent;
  @ViewChild("person") person: PersonComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  isreload: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  personID = null;
  @Input()
  personmembershipID = null;
  @Input()
  membershiptypeID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onpersonmembershipChange = new EventEmitter();

  personmemberships = [];
  personmembershipsAll = [];
  personmembership = {
    personmembership_ID: 0,
    person_ID: null,
    membershiptype_ID: {
      id: null
    },
    membership_SEQNO: null,
    association_NAME: null,
    joined_DATE: null,
    membership_GRADE: null,
    membership_NUMBER: null,
    isactive: true
  }

  constructor(
    private personmembershipservice: PersonmembershipService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (!this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    } else {
      redirectByHref(setting.redirctPath + "/#/home/personal");
    }
    var search = {
      person_ID: this.personID,
      membershiptype_ID: this.membershiptypeID,
    }

    this.personmemberships = JSON.parse(window.sessionStorage.getItem('personmemberships'));
    this.personmembershipsAll = JSON.parse(window.sessionStorage.getItem('personmembershipsAll'));

    // if (this.view >= 1 && this.view <= 2 && (this.personmemberships == null || this.personmemberships.length == 0 || reload == true)) {
    //   this.personmemberships == null;
     //   this.personmembershipGet();
    // }
    // if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personmembershipsAll == null || this.personmembershipsAll.length == 0 || reload == true)) {
    //   this.personmembershipsAll == null;
   //   this.personmembershipGetAll();
    // }

    if (this.view >= 5 && this.view <= 6 && this.personmembershipID) {
      window.sessionStorage.setItem("personmembership", this.personmembershipID);
      this.personmembershipGetOne(this.personmembershipID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personmemberships == null || this.personmemberships.length == 0 || reload == true)) {
      this.personmemberships == null;
      this.personmembershipAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personmembershipsAll == null || this.personmembershipsAll.length == 0 || reload == true)) {
      this.personmembershipsAll == null;
      this.personmembershipAdvancedSearchAll(search);
    }
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.load.bind(this, true),
        },
      }
    );
  }

  add() {
    this.personmembership = {
      personmembership_ID: 0,
      person_ID: null,
      membershiptype_ID: null,
      membership_SEQNO: null,
      association_NAME: null,
      joined_DATE: null,
      membership_GRADE: null,
      membership_NUMBER: null,
      isactive: true
    };
  }

  editView() {
    this.disabled = false;
  }

  cancelView() {
    this.cancel.next();
  }

  update(row) {
    this.edit.next(row);
  }

  personmembershipEdit() {
    this.disabled = false;
  }

  personmembershipCancel() {
    this.disabled = true;
    if (this.personmembership.personmembership_ID == 0) {
      this.router.navigate(["/home/personmemberships"], {});
    }
  }

  onChange(personequalityID) {
    for (var i = 0; i < this.personmembershipsAll.length; i++) {
      if (this.personmembershipsAll[i].personequality_ID == personequalityID) {
        this.onpersonmembershipChange.next(this.personmembershipsAll[i]);
        break;
      }
    }
  }

  setPersonmembership(response) {
    this.personmembershipID = response.personmembership_ID;
    this.personID = response.person_ID;
    this.membershiptypeID = response.membershiptype_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personmembership = response;
    this.disabled = true;
  }

  setPersonmemberships(response) {
    for (var i = 0; i < response.length; i++) {
      response[i].person = JSON.parse(response[i].person_DETAIL);
    }
    this.cancel.next();
    return response;
  }

  // personmembershipGet() {
  //   this.personmembershipservice.get().subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setPersonmembership(response);
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  // personmembershipGetAll() {
  //   this.personmembershipservice.getAll().subscribe(response => {
  //     if (response) {
  //       if (response.error && response.status) {
  //         this.toastrservice.warning("Message", " " + response.message);
  //       } else{
  //         this.setPersonmembership(response);
  //       }
  //     }
  //   }, error => {
  //     this.onfailservice.onFail(error);
  //   })
  // }

  personmembershipGetOne(id) {
    this.personmembershipservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonmembership(this.personmembershipservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personmembershipAdd(personmembership) {
    personmembership.membershiptype_ID = this.membershiptype.membershiptypeID;
    personmembership.person_ID = this.personID;
    personmembership.isactive = "Y";

    this.personmembershipservice.add(personmembership).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personmembership_ID) {
          this.toastrservice.success("Success", "New Person Membership Added");
          this.setPersonmembership(this.personmembershipservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          // this.personmembershipGetAll();
                } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personmembershipUpdate(personmembership) {
    personmembership.membershiptype_ID = this.membershiptype.membershiptypeID;
    personmembership.person_ID = this.personID;
    personmembership.isactive = "Y";

    if (personmembership.isactive == true) {
      personmembership.isactive = "Y";
    } else {
      personmembership.isactive = "N";
    }
    this.personmembershipservice.update(personmembership, personmembership.personmembership_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personmembership_ID) {
          this.toastrservice.success("Success", "Person Membership Updated");
          this.setPersonmembership(this.personmembershipservice.getDetail(response));
          this.refresh.next();
          this.disabled = true;
          // this.personmembershipGetAll();        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personmembershipSearch(str) {
    var search = {
      search: str
    }
    this.personmembershipservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonmemberships(this.personmembershipservice.getAllDetail(response));
          window.sessionStorage.setItem("personmemberships", JSON.stringify(this.personmemberships));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personmembershipSearchAll(str) {
    var search = {
      search: str
    }
    this.personmembershipservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonmemberships(this.personmembershipservice.getAllDetail(response));
          window.sessionStorage.setItem("personmembershipsAll", JSON.stringify(this.personmembershipsAll));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personmembershipAdvancedSearch(search) {
    this.personID = search.personID;
    this.membershiptypeID = search.membershiptypeID;
    this.personmembershipservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonmemberships(this.personmembershipservice.getAllDetail(response));
          window.sessionStorage.setItem("personmemberships", JSON.stringify(this.personmemberships));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personmembershipAdvancedSearchAll(search) {
    this.personID = search.personID;
    this.membershiptypeID = search.membershiptypeID;
    this.personmembershipservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonmemberships(this.personmembershipservice.getAllDetail(response));
          window.sessionStorage.setItem("personmembershipsAll", JSON.stringify(this.personmembershipsAll));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
