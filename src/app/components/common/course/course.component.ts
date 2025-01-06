import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { QualificationComponent } from '../qualification/qualification.component';
import { CourseService } from './course.service';
import { ProvisiontypeComponent } from '../../lookup/location/provisiontype/provisiontype.component';
import { CourseaimComponent } from '../../lookup/academics/courseaim/courseaim.component';
import { TeachertrainingcourseComponent } from '../../lookup/academics/teachertrainingcourse/teachertrainingcourse.component';
import { RegulatorybodyComponent } from '../../lookup/academics/regulatorybody/regulatorybody.component';
import { QualificationtypeComponent } from '../../lookup/academics/qualificationtype/qualificationtype.component';
import { SequencenumberComponent } from '../../common/sequencenumber/sequencenumber.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  @ViewChild("qualification") qualification: QualificationComponent;

  @ViewChild("provisiontype") provisiontype: ProvisiontypeComponent;
  @ViewChild("courseaim") courseaim: CourseaimComponent;
  @ViewChild("teachertrainingcourse") teachertrainingcourse: TeachertrainingcourseComponent;
  @ViewChild("regulatorybody") regulatorybody: RegulatorybodyComponent;
  @ViewChild("qualificationtype") qualificationtype: QualificationtypeComponent;

  @ViewChild("courselevel") courselevel: SequencenumberComponent;
  @ViewChild("minimumduration") minimumduration: SequencenumberComponent;
  @ViewChild("maximumduration") maximumduration: SequencenumberComponent;
  @ViewChild("minimumcredithours") minimumcredithours: SequencenumberComponent;
  @ViewChild("maximumcredithours") maximumcredithours: SequencenumberComponent;

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
  universityID = null;
  @Input()
  qualificationID = null;
  @Input()
  courseID = null;
  @Input()
  provisiontypeID = null;
  @Input()
  provisiontypeCode = null;
  @Input()
  courseaimID = null;
  @Input()
  courseaimCode = null;
  @Input()
  teachertrainingcourseID = null;
  @Input()
  teachertrainingcourseCode = null;
  @Input()
  regulatorybodyID = null;
  @Input()
  regulatorybodyCode = null;
  @Input()
  qualificationtypeID = null;
  @Input()
  qualificationtypeCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCourseChange = new EventEmitter();

  courses = [];
  coursesAll = [];
  course = {
    course_ID: 0,
    qualification_ID: null,
    course_CODE: null,
    course_TITLE: null,
    course_SHORTTITLE: null,
    course_INTRODUCTION: null,
    course_LEVEL: null,
    minimum_DURATION: null,
    maximum_DURATION: null,
    minimum_CREDITHOURS: null,
    maximum_CREDITHOURS: null,
    pathway: null,
    slc_COURSECODE: null,
    lara_CODE: null,
    qualificationtype_ID: null,
    provisiontype_ID: null,
    regulatorybody_ID: null,
    teachertrainingcourse_ID: null,
    courseaim_ID: null,
    mandatory_MODULES: null,
    optional_MODULES: null,
    studyskill_MODULES: null,
    isactive: true,
  }

  constructor(
    private courseservice: CourseService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('courses') != null) {
      this.courses = JSON.parse(window.sessionStorage.getItem('courses'));
    }
    if (window.sessionStorage.getItem('coursesAll') != null) {
      this.coursesAll = JSON.parse(window.sessionStorage.getItem('coursesAll'));
    }
    if (this.courseID != 0 && !this.courseID && Number(window.sessionStorage.getItem('course')) > 0) {
      this.courseID = Number(window.sessionStorage.getItem('course'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.courses == null || this.courses.length == 0 || reload == true)) {
      this.courses == null;
      this.courseGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.coursesAll == null || this.coursesAll.length == 0 || reload == true)) {
      this.coursesAll == null;
      this.courseGetAll();
    }

    var search = {
      university_ID: this.universityID,
      qualification_ID: this.qualificationID,
      provisiontype_ID: this.provisiontypeID,
      provisiontype_CODE: this.provisiontypeCode,
      courseaim_ID: this.courseaimID,
      courseaim_CODE: this.courseaimCode,
      teachertrainingcourse_ID: this.teachertrainingcourseID,
      teachertrainingcourse_CODE: this.teachertrainingcourseCode,
      regulatorybody_ID: this.regulatorybodyID,
      regulatorybody_CODE: this.regulatorybodyCode,
      qualificationtype_ID: this.qualificationtypeID,
      qualificationtype_CODE: this.qualificationtypeCode,
    }
    if (this.view >= 5 && this.view <= 6 && this.courseID) {
      window.sessionStorage.setItem("course", this.courseID);
      this.courseGetOne(this.courseID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.courses == null || this.courses.length == 0 || reload == true)) {
      this.courses == null;
      this.courseAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.coursesAll == null || this.coursesAll.length == 0 || reload == true)) {
      this.coursesAll == null;
      this.courseAdvancedSearchAll(search);
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
    this.course = {
      course_ID: 0,
      qualification_ID: null,
      course_CODE: null,
      course_TITLE: null,
      course_SHORTTITLE: null,
      course_INTRODUCTION: null,
      course_LEVEL: null,
      minimum_DURATION: null,
      maximum_DURATION: null,
      minimum_CREDITHOURS: null,
      maximum_CREDITHOURS: null,
      pathway: null,
      slc_COURSECODE: null,
      lara_CODE: null,
      qualificationtype_ID: null,
      provisiontype_ID: null,
      regulatorybody_ID: null,
      teachertrainingcourse_ID: null,
      courseaim_ID: null,
      mandatory_MODULES: null,
      optional_MODULES: null,
      studyskill_MODULES: null,
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

  courseEdit() {
    this.disabled = false;
  }

  courseCancel() {
    this.disabled = true;
    if (this.course.course_ID == 0) {
      this.router.navigate(["/home/courses"], {});
    }
  }

  onChange(courseID) {
    for (var i = 0; i < this.coursesAll.length; i++) {
      if (this.coursesAll[i].course_ID == courseID) {
        this.onCourseChange.next(this.coursesAll[i]);
        break;
      }
    }
  }

  setCourse(response) {
    this.courseID = response.course_ID;
    this.qualificationID = response.qualification_ID;
    this.qualificationtypeID = response.qualificationtype_ID;
    this.provisiontypeID = response.provisiontype_ID;
    this.regulatorybodyID = response.regulatorybody_ID;
    this.teachertrainingcourseID = response.teachertrainingcourse_ID;
    this.courseaimID = response.courseaim_ID;
    
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.course = response;
  }

  setCourses(response) {
    this.cancel.next();
    return response;
  }

  courseGet() {
    this.courseservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.courses = this.setCourses(this.courseservice.getAllDetail(response));
          window.sessionStorage.setItem("courses", JSON.stringify(this.courses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseGetAll() {
    this.courseservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.coursesAll = this.setCourses(this.courseservice.getAllDetail(response));
          window.sessionStorage.setItem("coursesAll", JSON.stringify(this.coursesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseGetOne(id) {
    this.disabled = true;
    this.courseservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCourse(this.courseservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseAdd(course) {
    if (this.qualification != null) {
      course.qualification_ID = this.qualification.qualificationID;
    }
    if (this.courseaim != null) {
      course.courseaim_ID = this.courseaim.courseaimID;
    }
    if (this.regulatorybody != null) {
      course.regulatorybody_ID = this.regulatorybody.regulatorybodyID;
    }
    if (this.teachertrainingcourse != null) {
      course.teachertrainingcourse_ID = this.teachertrainingcourse.teachertrainingcourseID;
    }
    if (this.provisiontype != null) {
      course.provisiontype_ID = this.provisiontype.provisiontypeID;
    }
    if (this.qualificationtype != null) {
      course.qualificationtype_ID = this.qualificationtype.qualificationtypeID;
    }

    if (this.courselevel != null) {
      course.course_LEVEL = this.courselevel.value;
    }
    if (this.minimumduration != null) {
      course.minimum_DURATION = this.minimumduration.value;
    }
    if (this.maximumduration != null) {
      course.maximum_DURATION = this.maximumduration.value;
    }
    if (this.minimumcredithours != null) {
      course.minimum_CREDITHOURS = this.minimumcredithours.value;
    }
    if (this.maximumcredithours != null) {
      course.maximum_CREDITHOURS = this.maximumcredithours.value;
    }
    course.isactive = "Y";

    this.courseservice.add(course).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.course_ID) {
          this.toastrservice.success("Success", "New Course Added");
          this.setCourse(this.courseservice.getDetail(response));
          this.refresh.next();
          this.courseGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseUpdate(course) {
    if (this.qualification != null) {
      course.qualification_ID = this.qualification.qualificationID;
    }
    if (this.courseaim != null) {
      course.courseaim_ID = this.courseaim.courseaimID;
    }
    if (this.regulatorybody != null) {
      course.regulatorybody_ID = this.regulatorybody.regulatorybodyID;
    }
    if (this.teachertrainingcourse != null) {
      course.teachertrainingcourse_ID = this.teachertrainingcourse.teachertrainingcourseID;
    }
    if (this.provisiontype != null) {
      course.provisiontype_ID = this.provisiontype.provisiontypeID;
    }
    if (this.qualificationtype != null) {
      course.qualificationtype_ID = this.qualificationtype.qualificationtypeID;
    }

    if (this.courselevel != null) {
      course.course_LEVEL = this.courselevel.value;
    }
    if (this.minimumduration != null) {
      course.minimum_DURATION = this.minimumduration.value;
    }
    if (this.maximumduration != null) {
      course.maximum_DURATION = this.maximumduration.value;
    }
    if (this.minimumcredithours != null) {
      course.minimum_CREDITHOURS = this.minimumcredithours.value;
    }
    if (this.maximumcredithours != null) {
      course.maximum_CREDITHOURS = this.maximumcredithours.value;
    }

    if (course.isactive == true) {
      course.isactive = "Y";
    } else {
      course.isactive = "N";
    }
    this.courseservice.update(course, course.course_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.course_ID) {
          this.toastrservice.success("Success", "Course Updated");
          this.setCourse(this.courseservice.getDetail(response));
          this.refresh.next();
          this.courseGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseUpdateAll(courses) {
    this.courseservice.updateAll(courses).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Courses Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseSearch(str) {
    var search = {
      search: str
    }
    this.courseservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.courses = this.setCourses(this.courseservice.getAllDetail(response));
          window.sessionStorage.setItem("courses", JSON.stringify(this.courses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseSearchAll(str) {
    var search = {
      search: str
    }
    this.courseservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.coursesAll = this.setCourses(this.courseservice.getAllDetail(response));
          window.sessionStorage.setItem("coursesAll", JSON.stringify(this.coursesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseAdvancedSearch(search) {
    this.universityID = search.university_ID;
    this.qualificationID = search.qualification_ID;
    this.provisiontypeID = search.provisiontype_ID;
    this.provisiontypeCode = search.provisiontype_CODE;
    this.courseaimID = search.courseaim_ID;
    this.courseaimCode = search.courseaim_CODE;
    this.regulatorybodyID = search.regulatorybody_ID;
    this.regulatorybodyCode = search.regulatorybody_CODE;
    this.teachertrainingcourseID = search.teachertrainingcourse_ID;
    this.teachertrainingcourseCode = search.teachertrainingcourse_CODE;
    this.qualificationtypeID = search.qualificationtype_ID;
    this.qualificationtypeCode = search.qualificationtype_CODE;
    this.courseservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.courses = this.setCourses(this.courseservice.getAllDetail(response));
          window.sessionStorage.setItem("courses", JSON.stringify(this.courses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseAdvancedSearchAll(search) {
    this.universityID = search.university_ID;
    this.qualificationID = search.qualification_ID;
    this.provisiontypeID = search.provisiontype_ID;
    this.provisiontypeCode = search.provisiontype_CODE;
    this.courseaimID = search.courseaim_ID;
    this.courseaimCode = search.courseaim_CODE;
    this.regulatorybodyID = search.regulatorybody_ID;
    this.regulatorybodyCode = search.regulatorybody_CODE;
    this.teachertrainingcourseID = search.teachertrainingcourse_ID;
    this.teachertrainingcourseCode = search.teachertrainingcourse_CODE;
    this.qualificationtypeID = search.qualificationtype_ID;
    this.qualificationtypeCode = search.qualificationtype_CODE;
    this.courseservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.coursesAll = this.setCourses(this.courseservice.getAllDetail(response));
          window.sessionStorage.setItem("coursesAll", JSON.stringify(this.coursesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
