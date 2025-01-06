import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { setting } from 'src/app/setting';
import { redirectByHref } from '../../../utilities/Shared_Funtions';

import { LocationsearchfilterComponent } from '../../location/locationsearchfilter/locationsearchfilter.component';


import { Router } from '@angular/router';
import { CareerlevelComponent } from '../../lookup/person/careerlevel/careerlevel.component';
import { OrganizationcategoryComponent } from '../../lookup/company/organizationcategory/organizationcategory.component';
import { OrganizationsectorComponent } from '../../lookup/company/organizationsector/organizationsector.component';
import { OrganizationtypeComponent } from '../../lookup/company/organizationtype/organizationtype.component';
import { WorkfieldComponent } from '../../lookup/person/workfield/workfield.component';
import { WorktypeComponent } from '../../lookup/person/worktype/worktype.component';
import { PersonComponent } from '../person/person.component';
import { PersonemploymentService } from './personemployment.service';

@Component({
  selector: 'app-personemployment',
  templateUrl: './personemployment.component.html',
  styleUrls: ['./personemployment.component.css']
})
export class PersonemploymentComponent implements OnInit {
  @ViewChild("person") person: PersonComponent;
  @ViewChild("worktype") worktype: WorktypeComponent;
  @ViewChild("workfield") workfield: WorkfieldComponent;
  @ViewChild("careerlevel") careerlevel: CareerlevelComponent;
  @ViewChild("organizationcategory") organizationcategory: OrganizationcategoryComponent;
  @ViewChild("organizationsector") organizationsector: OrganizationsectorComponent;
  @ViewChild("organizationtype") organizationtype: OrganizationtypeComponent;
  @ViewChild("locationsearchfilter") locationsearchfilter: LocationsearchfilterComponent;


  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  isreload: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  personID = null;
  @Input()
  worktypeID = null;
  @Input()
  worktypeCode = null;
  @Input()
  careerlevelID = null;
  @Input()
  careerlevelCode = null;
  @Input()
  locationID = null;
  @Input()
  organizationsectorID = null;
  @Input()
  organizationsectorCode = null;
  @Input()
  organizationcategoryID = null;
  @Input()
  organizationcategoryCode = null;
  @Input()
  workfieldID = null;
  @Input()
  workfieldCode = null;
  @Input()
  organizationtypeID = null;
  @Input()
  organizationtypeCode = null;
  @Input()
  personemploymentID = null;
  @Input()
  locationsearchfilterID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersonemploymentChange = new EventEmitter();

  personemployments = [];
  personemploymentsAll = [];
  personemployment = {
    personemployment_ID: 0,
    person_ID: null,
    employer_NAME: null,
    job_DESCRIPTION: null,
    startdate: null,
    enddate: null,
    address_LINE1: null,
    address_LINE2: null,
    address_LINE3: null,
    address_LINE4: null,
    address_LINE5: null,
    address_POSTCODE: null,
    contact_NUMBER: null,
    office_EMAIL: null,
    website: null,
    location_ID: null,
    locations: [],
    workfield_ID: {
      id: null
    },
    careerlevel_ID: {
      id: null
    },
    worktype_ID: {
      id: null
    },
    organizationtype_ID: {
      id: null
    },
    organizationsector_ID: {
      id: null
    },
    organizationcategory_ID: {
      id: null
    },
    isactive: true
  }

  constructor(
    private personemploymentservice: PersonemploymentService,
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

    if (window.sessionStorage.getItem('personemployments') != null) {
      this.personemployments = JSON.parse(window.sessionStorage.getItem('personemployments'));
    }
    if (window.sessionStorage.getItem('personemploymentsAll') != null) {
      this.personemploymentsAll = JSON.parse(window.sessionStorage.getItem('personemploymentsAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personemployments == null || this.personemployments.length == 0 || reload == true)) {
      this.personemployments == null;
      this.personemploymentGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personemploymentsAll == null || this.personemploymentsAll.length == 0 || reload == true)) {
      this.personemploymentsAll == null;
      this.personemploymentGetAll();
    }

    var search = {
      worktype_ID: this.worktypeID,
      worktype_CODE: this.worktypeCode,
      person_ID: this.personID,
      workfield_ID: this.workfieldID,
      workfield_CODE: this.workfieldCode,
      careerlevel_ID: this.careerlevelID,
      careerlevel_CODE: this.careerlevelCode,
      locationsearchfilter_ID: this.locationsearchfilterID,
      organizationsector_ID: this.organizationsectorID,
      organizationsector_CODE: this.organizationcategoryCode,
      organizationcategory_ID: this.organizationcategoryID,
      organizationcategory_CODE: this.organizationcategoryCode,
      organizationtype_ID: this.organizationtypeID,
      organizationtype_CODE: this.organizationtypeCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.personemploymentID) {
      window.sessionStorage.setItem("personemployment", this.personemploymentID);
      this.personemploymentGetOne(this.personemploymentID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personemployments == null || this.personemployments.length == 0 || reload == true)) {
      this.personemployments == null;
      this.personemploymentAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personemploymentsAll == null || this.personemploymentsAll.length == 0 || reload == true)) {
      this.personemploymentsAll == null;
      this.personemploymentAdvancedSearchAll(search);
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

  update(row) {
    this.edit.next(row);
  }

  editView() {
    this.disabled = false;
  }

  showView(row) {
    this.show.next(row);
  }

  cancelView() {
    this.cancel.next();
  }

  personemploymentEdit() {
    this.disabled = false;
  }

  personemploymentCancel() {
    this.disabled = true;
    if (this.personemployment.personemployment_ID == 0) {
      this.router.navigate(["/home/personemployments"], {});
    }
  }

  onChange(personemploymentID) {
    for (var i = 0; i < this.personemploymentsAll.length; i++) {
      if (this.personemploymentsAll[i].personemployment_ID == personemploymentID) {
        this.onPersonemploymentChange.next(this.personemploymentsAll[i]);
        break;
      }
    }
  }

  add() {
    this.personemployment = {
      personemployment_ID: 0,
      person_ID: null,
      address_LINE1: null,
      address_LINE2: null,
      address_LINE3: null,
      address_LINE4: null,
      address_LINE5: null,
      address_POSTCODE: null,
      contact_NUMBER: null,
      office_EMAIL: null,
      website: null,
      location_ID: null,
      locations: [],
      employer_NAME: null,
      job_DESCRIPTION: null,
      startdate: null,
      enddate: null,
      workfield_ID: null,
      careerlevel_ID: null,
      worktype_ID: null,
      organizationtype_ID: null,
      organizationsector_ID: null,
      organizationcategory_ID: null,
      isactive: true
    };
  }

  setPersonEmployment(response) {
    this.personemploymentID = response.personemployment_ID;
    this.locationID = response.location_ID;
    this.personID = response.person_ID;
    this.workfieldID = response.workfield_ID;
    this.worktypeID = response.worktype_ID;
    this.careerlevelID = response.careerlevel_ID;
    this.organizationtypeID = response.organizationtype_ID;
    this.organizationsectorID = response.organizationsector_ID;
    this.organizationcategoryID = response.organizationcategory_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personemployment = response;
    this.disabled = true;
  }

  setPersonEmployments(response) {
    this.cancel.next();
    return response;
  }

  personemploymentGet() {
    this.personemploymentservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personemployments = this.setPersonEmployments(this.personemploymentservice.getAllDetail(response));
          window.sessionStorage.setItem("personemployments", JSON.stringify(this.personemployments));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personemploymentGetOne(id) {
    this.personemploymentservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonEmployment(this.personemploymentservice.getDetail(response));
          // if (this.locationsearchfilter != null)
          //   this.locationsearchfilter.setLocation(this.personemployment.locations);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personemploymentGetAll() {
    this.personemploymentservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personemploymentsAll = this.setPersonEmployments(this.personemploymentservice.getAllDetail(response));
          window.sessionStorage.setItem("personemployments", JSON.stringify(this.personemployments));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personemploymentAdd(personemployment) {
    personemployment.worktype_ID = this.worktype.worktypeID;
    personemployment.person_ID = this.personID;
    personemployment.workfield_ID = this.workfield.workfieldID;
    personemployment.careerlevel_ID = this.careerlevel.careerlevelID;
    personemployment.location_ID = this.locationsearchfilter.locationID;
    personemployment.organizationsector_ID = this.organizationsector.organizationsectorID;
    personemployment.organizationcategory_ID = this.organizationcategory.organizationcategoryID;
    personemployment.organizationtype_ID = this.organizationtype.organizationtypeID;
    personemployment.isactive = "Y";

    this.personemploymentservice.add(personemployment).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personemployment_ID) {
          this.toastrservice.success("Success", "New Personemployments Added");
          this.setPersonEmployment(this.personemploymentservice.getDetail(response));
          this.refresh.next();
          this.personemploymentGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personemploymentUpdate(personemployment) {
    personemployment.worktype_ID = this.worktype.worktypeID;
    personemployment.person_ID = this.personID;
    personemployment.workfield_ID = this.workfield.workfieldID;
    personemployment.careerlevel_ID = this.careerlevel.careerlevelID;
    personemployment.location_ID = this.locationsearchfilter.locationID;
    personemployment.organizationsector_ID = this.organizationsector.organizationsectorID;
    personemployment.organizationcategory_ID = this.organizationcategory.organizationcategoryID;
    personemployment.organizationtype_ID = this.organizationtype.organizationtypeID;
    if (personemployment.isactive == true) {
      personemployment.isactive = "Y";
    } else {
      personemployment.isactive = "N";
    }
    this.personemploymentservice.update(personemployment, personemployment.personemployment_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personemployment_ID) {
          this.toastrservice.success("Success", " Personemployments Updated");
          this.setPersonEmployment(this.personemploymentservice.getDetail(response));
          this.refresh.next();
          this.personemploymentGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personemploymentUpdateAll(personemployments) {
    this.personemploymentservice.updateAll(personemployments).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Personemployments Updated");
          this.setPersonEmployment(this.personemploymentservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personemploymentSearch(str) {
    var search = {
      search: str
    }
    this.personemploymentservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personemployments = this.setPersonEmployments(this.personemploymentservice.getAllDetail(response));
          window.sessionStorage.setItem("personemployments", JSON.stringify(this.personemployments));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personemploymentSearchAll(str) {
    var search = {
      search: str
    }
    this.personemploymentservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personemploymentsAll = this.setPersonEmployments(this.personemploymentservice.getAllDetail(response));
          window.sessionStorage.setItem("personemployments", JSON.stringify(this.personemployments));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personemploymentAdvancedSearch(search) {
    this.worktypeID = search.worktype_ID;
    this.worktypeCode = search.worktype_CODE;
    this.personID = search.person_ID;
    this.workfieldID = search.workfield_ID;
    this.workfieldCode = search.workfield_CODE;
    this.careerlevelID = search.careerlevel_ID;
    this.careerlevelCode = search.careerlevel_CODE;
    this.locationsearchfilterID = search.locationsearchfilter_ID;
    this.organizationsectorID = search.organizationsector_ID;
    this.organizationsectorCode = search.organizationsector_CODE;
    this.organizationcategoryID = search.organizationcategory_ID;
    this.organizationcategoryCode = search.organizationcategory_CODE;
    this.organizationtypeID = search.organizationtype_ID;
    this.organizationtypeCode = search.organizationtype_CODE;
    this.personemploymentservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonEmployments(this.personemploymentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personemploymentAdvancedSearchAll(search) {
    this.worktypeID = search.worktype_ID;
    this.worktypeCode = search.worktype_CODE;
    this.personID = search.person_ID;
    this.workfieldID = search.workfield_ID;
    this.workfieldCode = search.workfield_CODE;
    this.careerlevelID = search.careerlevel_ID;
    this.careerlevelCode = search.careerlevel_CODE;
    this.locationsearchfilterID = search.locationsearchfilter_ID;
    this.organizationsectorID = search.organizationsector_ID;
    this.organizationsectorCode = search.organizationsector_CODE;
    this.organizationcategoryID = search.organizationcategory_ID;
    this.organizationcategoryCode = search.organizationcategory_CODE;
    this.organizationtypeID = search.organizationtype_ID;
    this.organizationtypeCode = search.organizationtype_CODE;

    this.personemploymentservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonEmployments(this.personemploymentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
