import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { LocationsearchfilterComponent } from '../../location/locationsearchfilter/locationsearchfilter.component';

import { PersonService } from './person.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  @ViewChild("locationsearchfilter") locationsearchfilter: LocationsearchfilterComponent;

  @Input()
  view: number = 0;
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
  locationID = null;
  @Input()
  birthplaceID = null;
  @Input()
  locationsearchfilterID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersonChange = new EventEmitter();

  persons = [];
  personsAll = [];
  person = {
    person_ID: 0,
    title: null,
    surname: null,
    previoussurname: null,
    forenames: null,
    middlename: null,
    nickname: null,
    birth_DATE: null,
    birth_TIME: null,
    birthplace_ID: null,
    birthplaces: [],
    personimg_PATH: null,
    isactive: true
  }

  constructor(
    private personservice: PersonService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('persons') != null) {
      this.persons = JSON.parse(window.sessionStorage.getItem('persons'));
    }
    if (window.sessionStorage.getItem('personsAll') != null) {
      this.personsAll = JSON.parse(window.sessionStorage.getItem('personsAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view == 0) {
      this.person = JSON.parse(window.sessionStorage.getItem('personal'));
      this.disabled = true;
    }
    this.persons = JSON.parse(window.sessionStorage.getItem('persons'));
    this.personsAll = JSON.parse(window.sessionStorage.getItem('personsAll'));

    this.route.queryParams.subscribe(params => {
      this.personID = params.person;
    });
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }


    if (this.view >= 1 && this.view <= 2 && (this.persons == null || this.persons.length == 0 || reload == true)) {
      this.persons == null;
      this.personGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personsAll == null || this.personsAll.length == 0 || reload == true)) {
      this.personsAll == null;
      this.personGetAll();
    }

    var search = {
      birthplace_ID: this.locationID,
    }

    if (this.view >= 5 && this.view <= 6 && this.personID) {
      window.sessionStorage.setItem("person", this.personID);
      this.personGetOne(this.personID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.persons == null || this.persons.length == 0 || reload == true)) {
      this.persons == null;
      this.personAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personsAll == null || this.personsAll.length == 0 || reload == true)) {
      this.personsAll == null;
      this.personAdvancedSearchAll(search);
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
    this.person = {
      person_ID: 0,
      title: null,
      surname: null,
      previoussurname: null,
      forenames: null,
      middlename: null,
      nickname: null,
      birth_DATE: null,
      birth_TIME: null,
      birthplace_ID: null,
      birthplaces: [],
      personimg_PATH: null,
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

  personEdit() {
    this.disabled = false;
  }

  personCancel() {
    this.disabled = true;
    if (this.person.person_ID == 0) {
      this.router.navigate(["/home/persons"], {});
    }
  }

  onChange(personID) {
    for (var i = 0; i < this.personsAll.length; i++) {
      if (this.personsAll[i].person_ID == personID) {
        this.onPersonChange.next(this.personsAll[i]);
        break;
      }
    }
  }

  setPerson(response) {
    this.personID = response.person_ID;
    this.birthplaceID = response.birthplace_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.person = response;
  }

  setPersons(response) {
    this.cancel.next();
    return response;
  }

  personGet() {
    this.personservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.persons = this.setPersons(this.personservice.getAllDetail(response));
          window.sessionStorage.setItem("persons", JSON.stringify(this.persons));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personGetAll() {
    this.personservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personsAll = this.setPersons(this.personservice.getAllDetail(response));
          window.sessionStorage.setItem("personsAll", JSON.stringify(this.personsAll));
          if (this.locationsearchfilter != null)
            this.locationsearchfilter.setLocation(this.person.birthplaces);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personGetOne(id) {
    this.disabled = true;
    this.personservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPerson(this.personservice.getDetail(response));
          window.sessionStorage.setItem("personal", JSON.stringify(this.person));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personAdd(person) {
    person.birthplace_ID = this.locationsearchfilter.locationID;
    person.isactive = "Y";

    this.personservice.add(person).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.person_ID) {
          this.toastrservice.success("Success", "New Person Added");
          this.setPerson(this.personservice.getDetail(response));
          this.refresh.next();
          this.personGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personUpdate(person) {
    person.birthplace_ID = this.locationsearchfilter.locationID;
    if (person.isactive == true) {
      person.isactive = "Y";
    } else {
      person.isactive = "N";
    }
    this.personservice.update(person, person.person_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.person_ID) {
          this.toastrservice.success("Success", "Person Updated");
          this.setPerson(this.personservice.getDetail(response));
          this.refresh.next();
          this.personGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personUpdateAll(persons) {
    this.personservice.updateAll(persons).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Persons Updated");
          this.setPerson(this.personservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personSearch(str) {
    var search = {
      search: str
    }
    this.personservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.persons = this.setPersons(this.personservice.getAllDetail(response));
          window.sessionStorage.setItem("persons", JSON.stringify(this.persons));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personSearchAll(str) {
    var search = {
      search: str
    }
    this.personservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personsAll = this.setPersons(this.personservice.getAllDetail(response));
          window.sessionStorage.setItem("personsAll", JSON.stringify(this.personsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personAdvancedSearch(search) {
    this.locationID = search.birthplace_ID;
    this.personservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.persons = this.setPersons(this.personservice.getAllDetail(response));
          window.sessionStorage.setItem("persons", JSON.stringify(this.persons));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personAdvancedSearchAll(search) {
    this.locationID = search.birthplace_ID;
    this.personservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personsAll = this.setPersons(this.personservice.getAllDetail(response));
          window.sessionStorage.setItem("personsAll", JSON.stringify(this.personsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
