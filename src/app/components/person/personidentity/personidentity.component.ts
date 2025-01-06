import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PersonidentityService } from './personidentity.service';
import { redirectByHref } from 'src/app/utilities/Shared_Funtions';
import { setting } from 'src/app/setting';
import { IdentitytypeComponent } from '../../lookup/person/identitytype/identitytype.component';

@Component({
  selector: 'app-personidentity',
  templateUrl: './personidentity.component.html',
  styleUrls: ['./personidentity.component.css']
})
export class PersonidentityComponent implements OnInit {
  @ViewChild("identitytype") identitytype: IdentitytypeComponent;

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
  personidentityID = null;
  @Input()
  personID = null;
  @Input()
  identitytypeID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersonidentityChange = new EventEmitter();

  personidentities = [];
  personidentitiesAll = [];
  personidentity = {
    personidentity_ID: 0,
    person_ID: null,
    identity_NUMBER: null,
    document_PATH: null,
    identitytype_ID: null,
    identity_DESC: null,
    isactive: true,
  }

  constructor(
    private personidentityservice: PersonidentityService,
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

    if (window.sessionStorage.getItem('personidentities') != null) {
      this.personidentities = JSON.parse(window.sessionStorage.getItem('personidentities'));
    }
    if (window.sessionStorage.getItem('personidentitiesAll') != null) {
      this.personidentitiesAll = JSON.parse(window.sessionStorage.getItem('personidentitiesAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personidentities == null || this.personidentities.length == 0 || reload == true)) {
      this.personidentities == null;
      this.personidentityGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personidentitiesAll == null || this.personidentitiesAll.length == 0 || reload == true)) {
      this.personidentitiesAll == null;
      this.personidentityGetAll();
    }

    var search = {
      person_ID: this.personID,
      identitytype_ID: this.identitytypeID,
    }
    if (this.view >= 5 && this.view <= 6 && this.personidentityID) {
      window.sessionStorage.setItem("personidentity", this.personidentityID);
      this.personidentityGetOne(this.personidentityID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personidentities == null || this.personidentities.length == 0 || reload == true)) {
      this.personidentities == null;
      this.personidentityAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personidentitiesAll == null || this.personidentitiesAll.length == 0 || reload == true)) {
      this.personidentitiesAll == null;
      this.personidentityAdvancedSearchAll(search);
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

  onChange(personidentityID) {
    for (var i = 0; i < this.personidentitiesAll.length; i++) {
      if (this.personidentitiesAll[i].personidentity_ID == personidentityID) {
        this.onPersonidentityChange.next(this.personidentitiesAll[i]);
        break;
      }
    }
  }

  add() {
    this.personidentity = {
      personidentity_ID: 0,
      person_ID: null,
      identity_NUMBER: null,
      document_PATH: null,
      identitytype_ID: null,
      identity_DESC: null,
      isactive: true,
    };
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

  personidentityEdit() {
    this.disabled = false;
  }

  personidentityCancel() {
    this.disabled = true;
    if (this.personidentity.personidentity_ID == 0) {
      this.router.navigate(["/home/personidentities"], {});
    }
  }

  setPersonidentity(response) {
    this.personidentityID = response.personidentity_ID;
    this.personID = response.person_ID;
    this.identitytypeID = response.identitytype_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personidentity = response;
  }

  setPersonidentities(response) {
    this.cancel.next();
    return response;
  }

  personidentityGet() {
    this.personidentityservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personidentities = this.setPersonidentities(this.personidentityservice.getAllDetail(response));
          window.sessionStorage.setItem("personidentities", JSON.stringify(this.personidentities));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personidentityGetAll() {
    this.personidentityservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personidentitiesAll = this.setPersonidentities(this.personidentityservice.getAllDetail(response));
          window.sessionStorage.setItem("personidentitiesAll", JSON.stringify(this.personidentitiesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personidentityGetOne(id) {
    this.disabled = true;
    this.personidentityservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personidentity_ID) {
          this.setPersonidentity(this.personidentityservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personidentityAdd(personidentity) {
    personidentity.person_ID = this.personID;
    personidentity.identitytype_ID = this.identitytype.identitytypeID;
    personidentity.isactive = "Y";

    this.personidentityservice.add(personidentity).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personidentity_ID) {
          this.toastrservice.success("Success", "New Person Contact Address Added");
          this.setPersonidentity(this.personidentityservice.getDetail(response));
          this.refresh.next();
          this.personidentityGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personidentityUpdate(personidentity) {
    personidentity.person_ID = this.personID;
    personidentity.identitytype_ID = this.identitytype.identitytypeID;

    if (personidentity.ispermanent == true) {
      personidentity.ispermanent = "Y";
    } else {
      personidentity.ispermanent = "N";
    }
    if (personidentity.isactive == true) {
      personidentity.isactive = "Y";
    } else {
      personidentity.isactive = "N";
    }
    this.personidentityservice.update(personidentity, personidentity.personidentity_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personidentity_ID) {
          this.toastrservice.success("Success", "Person Contact Address Updated");
          this.setPersonidentity(this.personidentityservice.getDetail(response));
          this.refresh.next();
          this.personidentityGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personidentityUpdateAll(personidentities) {
    this.personidentityservice.updateAll(personidentities).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Person Contact Addresses Updated");
          this.setPersonidentity(this.personidentityservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personidentitySearch(str) {
    var search = {
      search: str
    }
    this.personidentityservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personidentities = this.setPersonidentities(this.personidentityservice.getAllDetail(response));
          window.sessionStorage.setItem("personidentities", JSON.stringify(this.personidentities));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personidentitySearchAll(str) {
    var search = {
      search: str
    }
    this.personidentityservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personidentitiesAll = this.setPersonidentities(this.personidentityservice.getAllDetail(response));
          window.sessionStorage.setItem("personidentitiesAll", JSON.stringify(this.personidentitiesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personidentityAdvancedSearch(search) {
    this.identitytypeID = search.identitytype_ID;
    this.personID = search.person_ID;

    this.personidentityservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personidentities = this.setPersonidentities(this.personidentityservice.getAllDetail(response));
          window.sessionStorage.setItem("personidentities", JSON.stringify(this.personidentities));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personidentityAdvancedSearchAll(search) {
    this.identitytypeID = search.identitytype_ID;
    this.personID = search.person_ID;

    this.personidentityservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personidentitiesAll = this.setPersonidentities(this.personidentityservice.getAllDetail(response));
          window.sessionStorage.setItem("personidentitiesAll", JSON.stringify(this.personidentitiesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
