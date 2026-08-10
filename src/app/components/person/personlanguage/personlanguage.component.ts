import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';


import { PersonlanguageService } from './personlanguage.service';
import { Router } from '@angular/router';
import { CompetencyComponent } from '../../lookup/person/competency/competency.component';
import { FluencyComponent } from '../../lookup/person/fluency/fluency.component';
import { LanguageComponent } from '../../lookup/person/language/language.component';
import { PersonComponent } from '../person/person.component';

@Component({
  selector: 'app-personlanguage',
  templateUrl: './personlanguage.component.html',
  styleUrls: ['./personlanguage.component.css']
})
export class PersonlanguageComponent implements OnInit {
  @ViewChild("person") person: PersonComponent;
  @ViewChild("language") language: LanguageComponent;
  @ViewChild("competency") competency: CompetencyComponent;
  @ViewChild("fluency") fluency: FluencyComponent;

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
  personlanguageID = null;
  @Input()
  personID = null;
  @Input()
  languageID = null;
  @Input()
  fluencyID = null;
  @Input()
  competencyID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onpersonlanguageChange = new EventEmitter();

  personlanguages = [];
  personlanguagesAll = [];
  personlanguage = {
    personlanguage_ID: 0,
    person_ID: null,
    person_DETAIL: null,
    language_ID: {
      id: null
    },
    fluency_ID: {
      id: null
    },
    competency_ID: {
      id: null
    },

    comments: null,
    isactive: true
  }

  constructor(
    private personlanguageservice: PersonlanguageService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    this.personlanguages = JSON.parse(window.sessionStorage.getItem('personlanguages'));
    this.personlanguagesAll = JSON.parse(window.sessionStorage.getItem('personlanguagesAll'));
    if (!this.personlanguageID && Number(window.sessionStorage.getItem('personlanguage')) > 0) {
      this.personlanguageID = Number(window.sessionStorage.getItem('personlanguage'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personlanguages == null || this.personlanguages.length == 0 || reload == true)) {
      this.personlanguages == null;
      this.personlanguageGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personlanguagesAll == null || this.personlanguagesAll.length == 0 || reload == true)) {
      this.personlanguagesAll == null;
      this.personlanguageGetAll();
    }

    var search = {
      person_ID: this.personID,
      language_ID: this.languageID,
      fluency_ID: this.fluencyID,
      competency_ID: this.competencyID,
    }

    if (this.view >= 5 && this.view <= 6 && this.personlanguageID) {
      window.sessionStorage.setItem("personlanguage", this.personlanguageID);
      this.personlanguageGetOne(this.personlanguageID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personlanguages == null || this.personlanguages.length == 0 || reload == true)) {
      this.personlanguages == null;
      this.personlanguageAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personlanguagesAll == null || this.personlanguagesAll.length == 0 || reload == true)) {
      this.personlanguagesAll == null;
      this.personlanguageAdvancedSearchAll(search);
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
    this.personlanguage = {
      personlanguage_ID: 0,
      person_ID: null,
      person_DETAIL: null,
      language_ID: null,
      fluency_ID: null,
      competency_ID: null,
      comments: null,
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

  personlanguageEdit() {
    this.disabled = false;
  }

  personlanguageCancel() {
    this.disabled = true;
    if (this.personlanguage.personlanguage_ID == 0) {
      this.router.navigate(["/home/personlanguages"], {});
    }
  }

  onChange(personequalityID) {
    for (var i = 0; i < this.personlanguagesAll.length; i++) {
      if (this.personlanguagesAll[i].personequality_ID == personequalityID) {
        this.onpersonlanguageChange.next(this.personlanguagesAll[i]);
        break;
      }
    }
  }

  setpersonlanguage(response) {
    this.personlanguageID = response.personlanguage_ID;
    this.personID = response.person_ID;
    this.languageID = response.language_ID;
    this.fluencyID = response.fluency_ID;
    this.competencyID = response.competency_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personlanguage = response;
  }


  setpersonlanguages(response) {
    for (var i = 0; i < response.length; i++) {
      response[i].person = JSON.parse(response[i].person_DETAIL);
    }
    this.cancel.next();
    return response;
  }

  personlanguageGet() {
    this.personlanguageservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setpersonlanguages(this.personlanguageservice.getDetail(response));
          window.sessionStorage.setItem("personlanguages", JSON.stringify(this.personlanguages));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personlanguageGetOne(id) {
    this.disabled = true;
    this.personlanguageservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setpersonlanguage(this.personlanguageservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personlanguageGetAll() {
    this.personlanguageservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setpersonlanguages(this.personlanguageservice.getDetail(response));
          window.sessionStorage.setItem("personlanguagesAll", JSON.stringify(this.personlanguagesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personlanguageAdd(personlanguage) {
    personlanguage.language_ID = this.language.languageID;
    personlanguage.fluency_ID = this.fluency.fluencyID;
    personlanguage.person_ID = this.person.personID;
    personlanguage.competency_ID = this.competency.competencyID;
    personlanguage.isactive = "Y";

    this.personlanguageservice.add(personlanguage).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personlanguage_ID) {
          this.toastrservice.success("Success", "New Person Language Added");
          this.setpersonlanguage(this.personlanguageservice.getDetail(response));
          this.refresh.next();
          this.personlanguageGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personlanguageUpdate(personlanguage) {
    personlanguage.language_ID = this.language.languageID;
    personlanguage.fluency_ID = this.fluency.fluencyID;
    personlanguage.person_ID = this.person.personID;
    personlanguage.competency_ID = this.competency.competencyID;

    if (personlanguage.isactive == true) {
      personlanguage.isactive = "Y";
    } else {
      personlanguage.isactive = "N";
    }
    this.personlanguageservice.update(personlanguage, personlanguage.personlanguage_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personlanguage_ID) {
          this.toastrservice.success("Success", " Person Language Updated");
          this.setpersonlanguage(this.personlanguageservice.getDetail(response));
          this.refresh.next();
          this.personlanguageGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  personlanguageAdvancedSearch(search) {
    this.personID = search.person_ID;
    this.languageID = search.language_ID;
    this.competencyID = search.competency_ID;
    this.fluencyID = search.fluency_ID;
    this.personlanguageservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setpersonlanguages(this.personlanguageservice.getAllDetail(response));
          window.sessionStorage.setItem("personlanguages", JSON.stringify(this.personlanguages));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personlanguageAdvancedSearchAll(search) {
    this.personID = search.person_ID;
    this.languageID = search.language_ID;
    this.competencyID = search.competency_ID;
    this.fluencyID = search.fluency_ID;
    this.personlanguageservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        }
        else {
          this.setpersonlanguages(this.personlanguageservice.getAllDetail(response));
          window.sessionStorage.setItem("personlanguagesAll", JSON.stringify(this.personlanguagesAll));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
}
