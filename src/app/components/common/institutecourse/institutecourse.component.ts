import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CourseComponent } from '../course/course.component';
import { InstituteComponent } from '../institute/institute.component';
import { InstitutecourseService } from './institutecourse.service';

@Component({
  selector: 'app-institutecourse',
  templateUrl: './institutecourse.component.html',
  styleUrls: ['./institutecourse.component.css']
})
export class InstitutecourseComponent implements OnInit {
  @ViewChild("course") course: CourseComponent;
  @ViewChild("institute") institute: InstituteComponent;

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
  courseID = null;
  @Input()
  instituteID = null;
  @Input()
  institutecourseID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onInstituteCourseChange = new EventEmitter();

  institutecourses = [];
  institutecoursesAll = [];
  institutecourse = {
    institutecourse_ID: 0,
    institute_ID: null,
    course_ID: null,
    institutecourse_CODE: null,
    institutecourse_TITLE: null,
    institutecourse_SHORTTITLE: null,
    institutecourse_CREDITHOURS: null,
    isactive: true,
  }

  constructor(
    private institutecourseservice: InstitutecourseService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('institutecourses') != null) {
      this.institutecourses = JSON.parse(window.sessionStorage.getItem('institutecourses'));
    }
    if (window.sessionStorage.getItem('institutecoursesAll') != null) {
      this.institutecoursesAll = JSON.parse(window.sessionStorage.getItem('institutecoursesAll'));
    }
    if (this.institutecourseID != 0 && !this.institutecourseID && Number(window.sessionStorage.getItem('institutecourse')) > 0) {
      this.institutecourseID = Number(window.sessionStorage.getItem('institutecourse'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.institutecourses == null || this.institutecourses.length == 0 || reload == true)) {
      this.institutecourses == null;
      this.institutecourseGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.institutecoursesAll == null || this.institutecoursesAll.length == 0 || reload == true)) {
      this.institutecourses == null;
      this.institutecourseGetAll();
    }

    var search = {
      course_ID: this.courseID,
      institute_ID: this.instituteID,
    }
    if (this.view >= 5 && this.view <= 6 && this.institutecourseID) {
      window.sessionStorage.setItem("institutecourse", this.institutecourseID);
      this.institutecourseGetOne(this.institutecourseID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.institutecourses == null || this.institutecourses.length == 0 || reload == true)) {
      this.institutecourses == null
      this.institutecourseAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.institutecoursesAll == null || this.institutecoursesAll.length == 0 || reload == true)) {
      this.institutecourses == null;
      this.institutecourseAdvancedSearchAll(search);
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
    this.institutecourse = {
      institutecourse_ID: 0,
      institute_ID: null,
      course_ID: null,
      institutecourse_CODE: null,
      institutecourse_TITLE: null,
      institutecourse_SHORTTITLE: null,
      institutecourse_CREDITHOURS: null,
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

  institutecourseEdit() {
    this.disabled = false;
  }

  institutecourseCancel() {
    this.disabled = true;
    if (this.institutecourse.institutecourse_ID == 0) {
      this.router.navigate(["/home/institutecourses "], {});
    }
  }

  onChange(institutecourseID) {
    for (var i = 0; i < this.institutecoursesAll.length; i++) {
      if (this.institutecoursesAll[i].institutecourse_ID == institutecourseID) {
        this.onInstituteCourseChange.next(this.institutecoursesAll[i]);
        break;
      }
    }
  }

  setInstitutecourse(response) {
    this.institutecourseID = response.institutecourse_ID;
    this.instituteID = response.institute_ID;
    this.courseID = response.course_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.institutecourse = response;
  }

  setInstitutecourses(response) {
    this.cancel.next();
    return response;
  }

  institutecourseGet() {
    this.institutecourseservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutecourses = this.setInstitutecourses(this.institutecourseservice.getAllDetail(response));
          window.sessionStorage.setItem("institutecourses", JSON.stringify(this.institutecourses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  institutecourseGetAll() {
    this.institutecourseservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutecoursesAll = this.setInstitutecourses(this.institutecourseservice.getAllDetail(response));
          window.sessionStorage.setItem("institutecoursesAll", JSON.stringify(this.institutecoursesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  institutecourseGetOne(id) {
    this.disabled = true;
    this.institutecourseservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setInstitutecourse(this.institutecourseservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  institutecourseAdd(institutecourse) {
    institutecourse.isactive = "Y";

    institutecourse.course_ID = this.course.courseID;
    institutecourse.institute_ID = this.institute.instituteID;

    this.institutecourseservice.add(institutecourse).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.institutecourse_ID) {
          this.toastrservice.success("Success", "New Institute Course Added");
          this.refresh.next();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  institutecourseUpdate(institutecourse) {
    institutecourse.course_ID = this.course.courseID;
    institutecourse.institute_ID = this.institute.instituteID;

    if (institutecourse.isactive == true) {
      institutecourse.isactive = "Y";
    } else {
      institutecourse.isactive = "N";
    }
    this.institutecourseservice.update(institutecourse, institutecourse.institutecourse_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.institutecourse_ID) {
          this.toastrservice.success("Success", "Institute Course Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  institutecourseUpdateAll(institutecourses) {
    this.institutecourseservice.updateAll(institutecourses).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Institute Courses Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  institutecourseSearch(str) {
    var search = {
      search: str
    }
    this.institutecourseservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutecourses = this.setInstitutecourses(this.institutecourseservice.getAllDetail(response));
          window.sessionStorage.setItem("institutecourses", JSON.stringify(this.institutecourses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  institutecourseSearchAll(str) {
    var search = {
      search: str
    }
    this.institutecourseservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutecoursesAll = this.setInstitutecourses(this.institutecourseservice.getAllDetail(response));
          window.sessionStorage.setItem("institutecoursesAll", JSON.stringify(this.institutecoursesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  institutecourseAdvancedSearch(search) {
    this.courseID = search.course_ID;
    this.instituteID = search.institute_ID;
    this.institutecourseservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutecourses = this.setInstitutecourses(this.institutecourseservice.getAllDetail(response));
          window.sessionStorage.setItem("institutecourses", JSON.stringify(this.institutecourses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  institutecourseAdvancedSearchAll(search) {
    this.courseID = search.course_ID;
    this.instituteID = search.institute_ID;
    this.institutecourseservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutecoursesAll = this.setInstitutecourses(this.institutecourseservice.getAllDetail(response));
          window.sessionStorage.setItem("institutecoursesAll", JSON.stringify(this.institutecoursesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
