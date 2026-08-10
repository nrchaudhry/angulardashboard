import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { setting } from 'src/app/setting';
import { redirectByHref } from '../../../utilities/Shared_Funtions';

import { OnFailService } from '../../../services/on-fail.service';
import { ReferencepersonComponent } from '../referenceperson/referenceperson.component';

import { PersonreferenceService } from './personreference.service';
import { PersonrelationshipComponent } from '../../lookup/person/personrelationship/personrelationship.component';
@Component({
  selector: 'app-personreference',
  templateUrl: './personreference.component.html',
  styleUrls: ['./personreference.component.css']
})
export class PersonreferenceComponent implements OnInit {
  @ViewChild("referenceperson") referenceperson: ReferencepersonComponent;
  @ViewChild("personrelationship") personrelationship: PersonrelationshipComponent;

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
  personreferenceID = null;
  @Input()
  referencepersonID = null;
  @Input()
  personrelationshipID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onpersonreferenceChange = new EventEmitter();


  personreferences = [];
  personreferencesAll = [];
  personreference = {
    personreference_ID: 0,
    referenceperson_ID: null,
    person_ID: null,
    personrelationship_ID: {
      id: null,
    },

    iscontact: false,
    iskininfo: false,
    isactive: true
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

  personreferencesEdit() {
    this.disabled = false;
  }

  personreferencesCancel() {
    this.disabled = true;
    if (this.personreference.personreference_ID == 0) {
      this.router.navigate(["/home/personreferences"], {});
    }
  }

  onChange(personequalityID) {
    for (var i = 0; i < this.personreferencesAll.length; i++) {
      if (this.personreferencesAll[i].personequality_ID == personequalityID) {
        this.onpersonreferenceChange.next(this.personreferencesAll[i]);
        break;
      }
    }
  }

  constructor(
    private personreferenceservice: PersonreferenceService,
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
      referenceperson_ID: this.referencepersonID,
      personrelationship_ID: this.personrelationshipID,
    }

    if (this.view >= 1 && this.view <= 2 && (this.personreferences == null || this.personreferences.length == 0 || reload == true)) {
      this.personreferences == null;
      this.personreferenceGetAll();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personreferencesAll == null || this.personreferencesAll.length == 0 || reload == true)) {
      this.personreferencesAll == null;
      this.personreferenceGet()
    }

    if (this.personreferenceID != 0 && !this.personreferenceID && Number(window.sessionStorage.getItem('personreference')) > 0) {
      this.personreferenceID = Number(window.sessionStorage.getItem('personreference'));
    }
    if (this.view >= 5 && this.view <= 6 && this.personreferenceID) {
      window.sessionStorage.setItem("personreference", this.personreferenceID);
      this.personreferenceGetOne(this.personreferenceID);
      this.disabled = true;
    }
    else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personreferences == null || this.personreferences.length == 0 || reload == true)) {
      this.personreferences == null;
      this.personreferenceAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personreferencesAll == null || this.personreferencesAll.length == 0 || reload == true)) {
      this.personreferencesAll == null;
      this.personreferenceAdvancedSearchAll(search);
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
    this.personreference = {
      personreference_ID: 0,
      referenceperson_ID: null,
      person_ID: null,
      personrelationship_ID: null,
      iscontact: false,
      iskininfo: false,
      isactive: true
    };
  }

  update(row) {
    this.edit.next(row);
  }

  setPersonReference(response) {
    this.personreferenceID = response.personreference_ID;
    this.personID = response.person_ID;
    this.referencepersonID = response.referenceperson_ID;
    this.personrelationshipID = response.personrelationship_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personreference = response;
    this.disabled = true;
  }

  setPersonReferences(response) {
    this.cancel.next();
    return response;
  }

  personreferenceGet() {
    this.personreferenceservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.personreferenceservice.getAllDetail(response));
          window.sessionStorage.setItem("personreferences", JSON.stringify(this.personreferences));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personreferenceGetOne(id) {
    this.personreferenceservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReference(this.personreferenceservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personreferenceGetAll() {
    this.personreferenceservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.personreferenceservice.getAllDetail(response));
          window.sessionStorage.setItem("personreferencesAll", JSON.stringify(this.personreferencesAll));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personreferenceAdd(personreference) {
    personreference.referenceperson_ID = this.referenceperson.referencepersonID;
    personreference.personrelationship_ID = this.personrelationship.personrelationshipID;
    // personreference.person_ID = this.personID;
    personreference.isactive = "Y";

    this.personreferenceservice.add(personreference).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personreference_ID) {
          this.toastrservice.success("Success", "New Person Reference Added");
          this.setPersonReference(this.personreferenceservice.getDetail(response));
          this.refresh.next();
          this.personreferenceGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personreferenceUpdate(personreference) {
    personreference.referenceperson_ID = this.referenceperson.referencepersonID;
    personreference.personrelationship_ID = this.personrelationship.personrelationshipID;
    // personreference.person_ID = this.personID;
    if (personreference.isactive == true) {
      personreference.isactive = "Y";
    } else {
      personreference.isactive = "N";
    }
    this.personreferenceservice.update(personreference, personreference.personreference_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personreference_ID) {
          this.toastrservice.success("Success", " Person Reference Updated");
          this.setPersonReference(this.personreferenceservice.getDetail(response));
          this.refresh.next();
          this.personreferenceGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personreferenceSearch(str) {
    var search = {
      search: str
    }
    this.personreferenceservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.personreferenceservice.getAllDetail(response));
          window.sessionStorage.setItem("personreferences", JSON.stringify(this.personreferences));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personreferenceSearchAll(str) {
    var search = {
      search: str
    }
    this.personreferenceservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.personreferenceservice.getAllDetail(response));
          window.sessionStorage.setItem("personreferencesAll", JSON.stringify(this.personreferencesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personreferenceAdvancedSearch(search) {
    this.personID = search.personID;
    this.referencepersonID = search.referencepersonID;
    this.personrelationship = search.personRelationshipID;
    this.personreferenceservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.personreferenceservice.getAllDetail(response));
          window.sessionStorage.setItem("personreferences", JSON.stringify(this.personreferences));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personreferenceAdvancedSearchAll(search) {
    this.personID = search.personID;
    this.referencepersonID = search.referencepersonID;
    this.personrelationship = search.personRelationshipID;
    this.personreferenceservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.personreferenceservice.getAllDetail(response));
          window.sessionStorage.setItem("personreferencesAll", JSON.stringify(this.personreferencesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
