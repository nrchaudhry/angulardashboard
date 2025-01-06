import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { setting } from 'src/app/setting';
import { redirectByHref } from '../../../utilities/Shared_Funtions';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PersonComponent } from '../person/person.component';

import { PersoneducationqualificationService } from './personeducationqualification.service';
import { EducationattendancemodeComponent } from '../../lookup/person/educationattendancemode/educationattendancemode.component';
import { EducationsystemComponent } from '../../lookup/person/educationsystem/educationsystem.component';
import { GradingsystemComponent } from '../../lookup/person/gradingsystem/gradingsystem.component';
import { QualificationstatusComponent } from '../../lookup/person/qualificationstatus/qualificationstatus.component';
import { InstituteComponent } from '../../common/institute/institute.component';
import { InstitutecourseComponent } from '../../common/institutecourse/institutecourse.component';

@Component({
  selector: 'app-personeducationqualification',
  templateUrl: './personeducationqualification.component.html',
  styleUrls: ['./personeducationqualification.component.css']
})
export class PersoneducationqualificationComponent implements OnInit {
  @ViewChild("person") person: PersonComponent;
  @ViewChild("institute") institute: InstituteComponent;
  @ViewChild("institutecourse") institutecourse: InstitutecourseComponent;
  @ViewChild("educationsystem") educationsystem: EducationsystemComponent;
  @ViewChild("educationattendancemode") educationattendancemode: EducationattendancemodeComponent;
  @ViewChild("gradingsystem") gradingsystem: GradingsystemComponent;
  @ViewChild("qualificationstatus") qualificationstatus: QualificationstatusComponent;

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
  institutecourseID = null;
  @Input()
  personqualificationID = null;
  @Input()
  educationsystemID = null;
  @Input()
  educationattendancemodeID = null;
  @Input()
  gradingsystemID = null;
  @Input()
  personqualificationCode = null;
  @Input()
  educationsystemCode = null;
  @Input()
  educationattendancemodeCode = null;
  @Input()
  gradingsystemCode = null;
  @Input()
  qualificationstatusID = null;
  @Input()
  qualificationstatusCode = null;


  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersonEducationQualificationChange = new EventEmitter();

  personeducationqualifications = [];
  personeducationqualificationsAll = [];
  personeducationqualification = {
    personqualification_ID: 0,
    person_ID: 0,
    institutecourse_ID: null,
    educationsystem_ID: null,
    educationattendancemode_ID: null,
    qualificationstatus_ID: null,
    gradingsystem_ID: null,
    dissertation_TITLE: null,
    registration_NUMBER: null,
    qualification_STARTDATE: null,
    qualification_ENDDATE: null,
    total_MARKS: null,
    obtained_MARKS: null,
    obtained_PERCENTAGE: null,
    isactive: true
  }

  constructor(
    private personeducationqualificationservice: PersoneducationqualificationService,
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

    if (window.sessionStorage.getItem('personeducationqualifications') != null) {
      this.personeducationqualifications = JSON.parse(window.sessionStorage.getItem('personeducationqualifications'));
    }
    if (window.sessionStorage.getItem('personeducationqualificationsAll') != null) {
      this.personeducationqualificationsAll = JSON.parse(window.sessionStorage.getItem('personeducationqualificationsAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personeducationqualifications == null || this.personeducationqualifications.length == 0 || reload == true)) {
      this.personeducationqualifications == null;
      this.personeducationqualificationGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personeducationqualificationsAll == null || this.personeducationqualificationsAll.length == 0 || reload == true)) {
      this.personeducationqualificationsAll == null;
      this.personeducationqualificationGetAll();
    }

    var search = {
      person_ID: this.personID,
      institutecourse_ID: this.institutecourseID,
      gradingsystem_ID: this.gradingsystemID,
      qualificationstatus_ID: this.qualificationstatusID,
      educationattendancemode_ID: this.educationattendancemodeID,
      gradingsystem_CODE: this.gradingsystemCode,
      qualificationstatus_CODE: this.qualificationstatusCode,
      educationattendancemode_CODE: this.educationattendancemodeCode,
    }

    if (this.view >= 5 && this.view <= 6 && this.personqualificationID) {
      window.sessionStorage.setItem("personeducationqualification", this.personqualificationID);
      this.personeducationqualificationGetOne(this.personqualificationID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personeducationqualifications == null || this.personeducationqualifications.length == 0 || reload == true)) {
      this.personeducationqualifications == null;
      this.personeducationqualificationAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personeducationqualificationsAll == null || this.personeducationqualificationsAll.length == 0 || reload == true)) {
      this.personeducationqualificationsAll == null;
      this.personeducationqualificationAdvancedSearchAll(search);
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

  onInstituteChange(institute) {
    console.log(institute);
    var search = {
      institute_ID: institute.institute_ID
    }
    if (this.institutecourse != null && this.institutecourse.disabled == false) {
      this.institutecourse.institutecourseAdvancedSearch(search);
    } else if (this.institutecourse != null && this.institutecourse.disabled == true) {
      this.institutecourse.institutecourseAdvancedSearchAll(search);
    }
  }

  onChange(personqualificationID) {
    for (var i = 0; i < this.personeducationqualificationsAll.length; i++) {
      if (this.personeducationqualificationsAll[i].personeducationqualification_ID == personqualificationID) {
        this.onPersonEducationQualificationChange.next(this.personeducationqualificationsAll[i]);
        break;
      }
    }
  }

  add() {
    this.personeducationqualification = {
      personqualification_ID: 0,
      person_ID: null,
      institutecourse_ID: null,
      educationsystem_ID: null,
      educationattendancemode_ID: null,
      qualificationstatus_ID: null,
      gradingsystem_ID: null,
      dissertation_TITLE: null,
      registration_NUMBER: null,
      qualification_STARTDATE: null,
      qualification_ENDDATE: null,
      total_MARKS: null,
      obtained_MARKS: null,
      obtained_PERCENTAGE: null,
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

  personeducationqualificationEdit() {
    this.disabled = false;
  }

  personeducationqualificationCancel() {
    this.disabled = true;
    this.personeducationqualificationAdvancedSearch(this.personID);
    if (this.personeducationqualification.personqualification_ID == 0) {
      this.router.navigate(["/home/personeducationqualifications"], {});
    }
  }

  setPersoneducationqualification(response) {
    this.personqualificationID = response.personqualification_ID;
    this.personID = response.person_ID;
    this.educationsystemID = response.educationsystem_ID;
    this.educationattendancemodeID = response.educationattendancemodeID;
    this.qualificationstatusID = response.qualificationstatus_ID;
    this.gradingsystemID = response.gradingsystem_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personeducationqualification = response;
    this.disabled = true;
  }

  setPersoneducationqualifications(response) {
    this.cancel.next();
    return response;
  }

  personeducationqualificationGet() {
    this.personeducationqualificationservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationqualifications = this.setPersoneducationqualifications(this.personeducationqualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationqualifications", JSON.stringify(this.personeducationqualifications));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationqualificationGetAll() {
    this.personeducationqualificationservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationqualificationsAll = this.setPersoneducationqualifications(this.personeducationqualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationqualifications", JSON.stringify(this.personeducationqualifications));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationqualificationGetOne(id) {
    this.personeducationqualificationservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersoneducationqualification(this.personeducationqualificationservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  personeducationqualificationAdd(personeducationqualification) {
    personeducationqualification.person_ID = this.personID;
    personeducationqualification.institutecourse_ID = this.institutecourse.institutecourseID;
    personeducationqualification.qualificationstatus_ID = this.qualificationstatus.qualificationstatusID;
    personeducationqualification.gradingsystem_ID = this.gradingsystem.gradingsystemID;
    personeducationqualification.educationsystem_ID = this.educationsystem.educationsystemID;
    personeducationqualification.educationattendancemode_ID = this.educationattendancemode.educationattendancemodeID;
    personeducationqualification.isactive = "Y";

    this.personeducationqualificationservice.add(personeducationqualification).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personqualification_ID) {
          this.toastrservice.success("Success", "New Personeducationqualification Added");
          this.setPersoneducationqualification(this.personeducationqualificationservice.getDetail(response));
          this.refresh.next();
          this.personeducationqualificationGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationqualificationUpdate(personeducationqualification) {
    personeducationqualification.person_ID = this.personID;
    personeducationqualification.institutecourse_ID = this.institutecourse.institutecourseID;
    personeducationqualification.qualificationstatus_ID = this.qualificationstatus.qualificationstatusID;
    personeducationqualification.gradingsystem_ID = this.gradingsystem.gradingsystemID;
    personeducationqualification.educationattendancemode_ID = this.educationattendancemode.educationattendancemodeID;
    personeducationqualification.educationsystem_ID = this.educationsystem.educationsystemID;
    if (personeducationqualification.isactive == true) {
      personeducationqualification.isactive = "Y";
    } else {
      personeducationqualification.isactive = "N";
    }
    this.personeducationqualificationservice.update(personeducationqualification, personeducationqualification.personqualification_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personqualification_ID) {
          this.toastrservice.success("Success", " Person Education Qualification Updated");
          this.setPersoneducationqualification(this.personeducationqualificationservice.getDetail(response));
          this.refresh.next();
          this.personeducationqualificationGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationqualificationUpdateAll(personeducationqualifications) {
    this.personeducationqualificationservice.updateAll(personeducationqualifications).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Person Education Qualifications Updated");
          this.setPersoneducationqualification(this.personeducationqualificationservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationqualificationSearch(str) {
    var search = {
      search: str
    }
    this.personeducationqualificationservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationqualifications = this.setPersoneducationqualifications(this.personeducationqualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationqualifications", JSON.stringify(this.personeducationqualifications));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationqualificationSearchAll(str) {
    var search = {
      search: str
    }
    this.personeducationqualificationservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationqualificationsAll = this.setPersoneducationqualifications(this.personeducationqualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationqualifications", JSON.stringify(this.personeducationqualifications));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationqualificationAdvancedSearch(search) {
    this.personID = search.person_ID;
    this.institutecourseID = search.institutecourse_ID;
    this.gradingsystemID = search.gradingsystem_ID;
    this.gradingsystemCode = search.gradingsystem_CODE;
    this.qualificationstatusID = search.qualificationstatus_ID;
    this.qualificationstatusCode = search.qualificationstatus_CODE;
    this.educationattendancemodeID = search.educationattendancemode_ID;
    this.educationattendancemodeCode = search.educationattendancemode_CODE;

    this.personeducationqualificationservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationqualifications = response;
          if (this.personeducationqualifications.length > 0) {
            this.personeducationqualifications = this.setPersoneducationqualifications(this.personeducationqualificationservice.getDetail(this.personeducationqualifications[0]));
            window.sessionStorage.setItem("personeducationqualifications", JSON.stringify(this.personeducationqualifications));

          } else
            this.add();
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personeducationqualificationAdvancedSearchAll(search) {
    this.personID = search.person_ID;
    this.institutecourseID = search.institutecourse_ID;
    this.gradingsystemID = search.gradingsystem_ID;
    this.gradingsystemCode = search.gradingsystem_CODE;
    this.qualificationstatusID = search.qualificationstatus_ID;
    this.qualificationstatusCode = search.qualificationstatus_CODE;
    this.educationattendancemodeID = search.educationattendancemode_ID;
    this.educationattendancemodeCode = search.educationattendancemode_CODE;

    this.personeducationqualificationservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personeducationqualificationsAll = this.setPersoneducationqualifications(this.personeducationqualificationservice.getAllDetail(response));
          window.sessionStorage.setItem("personeducationqualifications", JSON.stringify(this.personeducationqualifications));

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
