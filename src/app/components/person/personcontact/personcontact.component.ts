import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';


import { PersoncontactService } from './personcontact.service';
import { redirectByHref } from 'src/app/utilities/Shared_Funtions';
import { setting } from 'src/app/setting';
import { ContacttypeComponent } from '../../lookup/common/contacttype/contacttype.component';

@Component({
  selector: 'app-personcontact',
  templateUrl: './personcontact.component.html',
  styleUrls: ['./personcontact.component.css']
})
export class PersoncontactComponent implements OnInit {
  @ViewChild("contacttype") contacttype: ContacttypeComponent;

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
  personcontactID = null;
  @Input()
  contacttypeID = null;
  @Input()
  contacttypeCode = null;
  @Input()
  personID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersonContactChange = new EventEmitter();

  contacttypeActive: any = [];
  personcontacts = [];
  personcontactsAll = [];
  personcontact = {
    personcontact_ID: 0,
    person_ID: null,
    contacttype_ID: null,
    contact_VALUE: null,
    isverified: true,
    ispreaferd: true,
    isactive: true
  }
  personcontactinfo = {
    personcontact_ID: null,
    person_ID: null,
    contact_TYPE: null,
    contact_VALUE: null,
    ispreaferd: false,
    isverified: false,
    isactive: true
  };
  email = {
    personcontact_ID: null,
    person_ID: null,
    contact_TYPE: 1,
    contact_VALUE: null,
    ispreaferd: false,
    isverified: false,
    isactive: true
  };
  telephone = {
    personcontact_ID: null,
    person_ID: null,
    contact_TYPE: 2,
    contact_VALUE: null,
    ispreaferd: false,
    isverified: false,
    isactive: true
  };
  mobile = {
    personcontact_ID: null,
    person_ID: null,
    contact_TYPE: 3,
    contact_VALUE: null,
    ispreaferd: false,
    isverified: false,
    isactive: true
  };

  constructor(
    private personcontactservice: PersoncontactService,
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

    if (window.sessionStorage.getItem('personcontacts') != null) {
      this.personcontacts = JSON.parse(window.sessionStorage.getItem('personcontacts'));
    }
    if (window.sessionStorage.getItem('personcontactsAll') != null) {
      this.personcontactsAll = JSON.parse(window.sessionStorage.getItem('personcontactsAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personcontacts == null || this.personcontacts.length == 0 || reload == true)) {
      this.personcontacts == null;
      this.personcontactGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personcontactsAll == null || this.personcontactsAll.length == 0 || reload == true)) {
      this.personcontactsAll == null;
      this.personcontactGetAll();
    }

    var search = {
      person_ID: this.personID,
      contactype_ID: this.contacttypeID,
      contactype_CODE: this.contacttypeCode,
    }
    if (this.view >= 5 && this.view <= 6 && this.personcontactID) {
      window.sessionStorage.setItem("personcontact", this.personcontactID);
      this.personcontactGetOne(this.personcontactID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personcontacts == null || this.personcontacts.length == 0 || reload == true)) {
      this.personcontacts == null;
      this.personcontactAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personcontactsAll == null || this.personcontactsAll.length == 0 || reload == true)) {
      this.personcontactsAll == null;
      this.personcontactAdvancedSearchAll(search);
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

  onChange(personcontactID) {
    for (var i = 0; i < this.personcontactsAll.length; i++) {
      if (this.personcontactsAll[i].personcontact_ID == personcontactID) {
        this.onPersonContactChange.next(this.personcontactsAll[i]);
        break;
      }
    }
  }

  add() {
    this.personcontact = {
      personcontact_ID: 0,
      person_ID: null,
      contacttype_ID: null,
      contact_VALUE: null,
      isverified: true,
      ispreaferd: true,
      isactive: true
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

  personcontactEdit() {
    this.disabled = false;
  }

  personcontactCancel() {
    this.disabled = true;
    if (this.personcontact.personcontact_ID == 0) {
      this.router.navigate(["/home/personcontacts"], {});
    }
  }

  setPersoncontact(response) {
    this.personcontactID = response.personcontact_ID;
    this.personID = response.person_ID;
    this.contacttypeID = response.contacttype_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personcontact = response;
  }

  setPersoncontacts(response) {
    this.cancel.next();
    return response;
  }

  personcontactGet() {
    this.personcontactservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontacts = this.setPersoncontacts(this.personcontactservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontacts", JSON.stringify(this.personcontacts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactGetAll() {
    this.personcontactservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontactsAll = this.setPersoncontacts(this.personcontactservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontactsAll", JSON.stringify(this.personcontactsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactGetOne(id) {
    this.disabled = true;
    this.personcontactservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersoncontact(this.personcontactservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactAdd(personcontact) {
    personcontact.person_ID = this.personID;
    personcontact.contacttype_ID = this.contacttype.contacttypeID;
    personcontact.isactive = "Y";

    this.personcontactservice.add(personcontact).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personcontact_ID) {
          this.toastrservice.success("Success", "New Person Contact Added");
          this.setPersoncontact(this.personcontactservice.getDetail(response));
          this.refresh.next();
          this.personcontactGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactUpdate(personcontact) {
    personcontact.person_ID = this.personID;
    personcontact.contacttype_ID = this.contacttype.contacttypeID;

    if (personcontact.isactive == true) {
      personcontact.isactive = "Y";
    } else {
      personcontact.isactive = "N";
    }
    this.personcontactservice.update(personcontact, personcontact.personcontact_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personcontact_ID) {
          this.toastrservice.success("Success", "Person Contact Updated");
          this.setPersoncontact(this.personcontactservice.getDetail(response));
          this.refresh.next();
          this.personcontactGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactUpdateAll(personcontacts) {
    this.personcontactservice.updateAll(personcontacts).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Person Contacts Updated");
          this.setPersoncontact(this.personcontactservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactSearch(str) {
    var search = {
      search: str
    }
    this.personcontactservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontacts = this.setPersoncontacts(this.personcontactservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontacts", JSON.stringify(this.personcontacts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactSearchAll(str) {
    var search = {
      search: str
    }
    this.personcontactservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontactsAll = this.setPersoncontacts(this.personcontactservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontactsAll", JSON.stringify(this.personcontactsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactAdvancedSearch(search) {
    this.contacttypeID = search.contacttype_ID;
    this.contacttypeCode = search.contacttype_CODE;
    this.personID = search.person_ID;
    this.personcontactservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontacts = this.setPersoncontacts(this.personcontactservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontacts", JSON.stringify(this.personcontacts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactAdvancedSearchAll(search) {
    this.contacttypeID = search.contacttype_ID;
    this.contacttypeCode = search.contacttype_CODE;
    this.personID = search.person_ID;
    this.personcontactservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontactsAll = this.setPersoncontacts(this.personcontactservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontactsAll", JSON.stringify(this.personcontactsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
