import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { OnFailService } from '../../../services/on-fail.service';

import { PersonComponent } from '../person/person.component';

import { PersoneducationinstituteService } from './personeducationinstitute.service';
import { EducationattendancemodeComponent } from '../../lookup/person/educationattendancemode/educationattendancemode.component';
import { EducationinstituteComponent } from '../../lookup/person/educationinstitute/educationinstitute.component';
@Component({
  selector: 'app-personeducationinstitute',
  templateUrl: './personeducationinstitute.component.html',
  styleUrls: ['./personeducationinstitute.component.css']
})
export class PersoneducationinstituteComponent implements OnInit {
  @ViewChild("person") person: PersonComponent;
  @ViewChild("educationinstitute") educationinstitute: EducationinstituteComponent;
  @ViewChild("educationattendancemode") educationattendancemode: EducationattendancemodeComponent;

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
  personinstituteID = null;
  @Input()
  personID = null;
  @Input()
  educationinstituteID = null;
  @Input()
  educationattendancemodeID = null;
  @Input()
  personCode = null;
  @Input()
  educationinstituteCode = null;
  @Input()
  educationattendancemodeCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersoneducationinstituteChange = new EventEmitter();

  personeducationinstitutes = [];
  personeducationinstitutesAll = [];
  personeducationinstitute = {
    personinstitute_ID: 0,
    personinstitute_ENDDATE: null,
    personinstitute_STARTDATE: null,
    educationinstitute_DESC: null,
    educationinstitute_ID: {
      id: null
    },
    educationattendancemode_ID: {
      id: null
    },
    person_ID: null,
    recievedqualification: true,
    isactive: true
  }

  constructor(
    private personeducationinstituteservice: PersoneducationinstituteService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (window.sessionStorage.getItem('personeducationinstitutes') != null) {
      this.personeducationinstitutes = JSON.parse(window.sessionStorage.getItem('personeducationinstitutes'));
    }
    if (window.sessionStorage.getItem('personeducationinstitutesAll') != null) {
      this.personeducationinstitutesAll = JSON.parse(window.sessionStorage.getItem('personeducationinstitutesAll'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personeducationinstitutes == null || this.personeducationinstitutes.length == 0 || reload == true)) {
      this.personeducationinstitutes == null;
      this.personeducationinstituteGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personeducationinstitutesAll == null || this.personeducationinstitutesAll.length == 0 || reload == true)) {
      this.personeducationinstitutesAll == null;
      this.personeducationinstituteGetAll();
    }

    var search = {
      person_ID: this.personID,
      educationinstitute_ID: this.educationinstituteID,
      educationattendancemode_ID: this.educationattendancemodeID,
    }
    if (this.view >= 5 && this.view <= 6 && this.personinstituteID) {
      window.sessionStorage.setItem("personeducationinstitute", this.personinstituteID);
      this.personeducationinstituteGetOne(this.personID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personeducationinstitutes == null || this.personeducationinstitutes.length == 0 || reload == true)) {
      this.personeducationinstitutes == null;
      this.personeducationinstituteAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personeducationinstitutesAll == null || this.personeducationinstitutesAll.length == 0 || reload == true)) {
      this.personeducationinstitutesAll == null;
      this.personeducationinstituteAdvancedSearchAll(search);
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

  onChange(personeducationinstituteID) {
    for (var i = 0; i < this.personeducationinstitutesAll.length; i++) {
      if (this.personeducationinstitutesAll[i].personeducationinstitute_ID == personeducationinstituteID) {
        this.onPersoneducationinstituteChange.next(this.personeducationinstitutesAll[i]);
        break;
      }
    }
  }

  add() {
    this.personeducationinstitute = {
      personinstitute_ID: 0,
      personinstitute_ENDDATE: null,
      personinstitute_STARTDATE: null,
      educationinstitute_DESC: null,
      educationinstitute_ID: null,
      educationattendancemode_ID: null,
      person_ID: null,
      recievedqualification: true,
      isactive: true
    };
  }

  update(row) {
    this.edit.next(row);
  }
  editView() {
    this.disabled = false;
  }

  cancelView() {
  }

  personeducationinstituteEdit() {
    this.disabled = false;
  }

  personeducationinstituteCancel() {
    this.disabled = true;
    if (this.personeducationinstitute.personinstitute_ID == 0) {
      this.router.navigate(["/home/personeducationinstitutes"], {});
    }
  }

  setpersoneducationinstitute(response) {
    this.personinstituteID = response.personinstitute_ID;
    this.personID = response.person_ID;
    this.educationinstituteID = response.educationinstitute_ID;
    this.educationattendancemodeID = response.educationattendancemode_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personeducationinstitute = response;
  }


  setpersoneducationinstitutes(response) {
    this.cancel.next();
    return response;
  }

  personeducationinstituteGetOne(id) {
    this.disabled = true;
    this.personeducationinstituteservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setpersoneducationinstitute(this.personeducationinstituteservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationinstituteGet() {
    this.personeducationinstituteservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationinstitutes = this.setpersoneducationinstitutes(this.personeducationinstituteservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationinstitutes", JSON.stringify(this.personeducationinstitutes));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationinstituteGetAll() {
    this.personeducationinstituteservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationinstitutesAll = this.setpersoneducationinstitutes(this.personeducationinstituteservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationinstitutesAll", JSON.stringify(this.personeducationinstitutesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationinstituteAdd(personeducationinstitute) {
    personeducationinstitute.person_ID = this.person.personID;
    personeducationinstitute.educationinstitute_ID = this.educationinstitute.educationinstituteID;
    personeducationinstitute.educationattendancemode_ID = this.educationattendancemode.educationattendancemodeID;
    personeducationinstitute.isactive = "Y";

    this.personeducationinstituteservice.add(personeducationinstitute).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personinstitute_ID) {
          this.toastrservice.success("Success", "New Person Education Institute Added");
          this.setpersoneducationinstitute(this.personeducationinstituteservice.getDetail(response));
          this.refresh.next();
          this.personeducationinstituteGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationinstituteUpdate(personeducationinstitute) {
    personeducationinstitute.person_ID = this.person.personID;
    personeducationinstitute.educationinstitute_ID = this.educationinstitute.educationinstituteID;
    personeducationinstitute.educationattendancemode_ID = this.educationattendancemode.educationattendancemodeID;
    if (personeducationinstitute.isactive == true) {
      personeducationinstitute.isactive = "Y";
    } else {
      personeducationinstitute.isactive = "N";
    }
    this.personeducationinstituteservice.update(personeducationinstitute, personeducationinstitute.personinstitute_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personinstitute_ID) {
          this.toastrservice.success("Success", "Person Education Institutes Updated");
          this.setpersoneducationinstitute(this.personeducationinstituteservice.getDetail(response));
          this.refresh.next();
          this.personeducationinstituteGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationinstituteUpdateAll(personeducationinstitutes) {
    this.personeducationinstituteservice.updateAll(personeducationinstitutes).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Person Education Institutes Updated");
          this.setpersoneducationinstitute(this.personeducationinstituteservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationinstituteSearch(str) {
    var search = {
      search: str
    }
    this.personeducationinstituteservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationinstitutes = this.setpersoneducationinstitutes(this.personeducationinstituteservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationinstitutes", JSON.stringify(this.personeducationinstitutes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationinstituteSearchAll(str) {
    var search = {
      search: str
    }
    this.personeducationinstituteservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationinstitutesAll = this.setpersoneducationinstitutes(this.personeducationinstituteservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationinstitutesAll", JSON.stringify(this.personeducationinstitutesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }


  personeducationinstituteAdvancedSearch(search) {
    this.personID = search.person_ID;
    this.educationinstituteID = search.educationinstitute_ID;
    this.educationinstituteCode = search.educationinstitute_CODE;
    this.educationattendancemodeID = search.educationattendancemode_ID;
    this.educationattendancemodeCode = search.educationattendancemode_CODE;


    this.personeducationinstituteservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setpersoneducationinstitutes(this.personeducationinstituteservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationinstitutes", JSON.stringify(this.personeducationinstitutes));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationinstituteAdvancedSearchAll(search) {
    this.personID = search.person_ID;
    this.educationinstituteID = search.educationinstitute_ID;
    this.educationinstituteCode = search.educationinstitute_CODE;
    this.educationattendancemodeID = search.educationattendancemode_ID;
    this.educationattendancemodeCode = search.educationattendancemode_CODE;

    this.personeducationinstituteservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        }
        else {
          this.setpersoneducationinstitutes(this.personeducationinstituteservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationinstitutesAll", JSON.stringify(this.personeducationinstitutesAll));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
}
