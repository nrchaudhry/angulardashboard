
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-teachertrainingcourse',
  templateUrl: './teachertrainingcourse.component.html',
  styleUrls: ['./teachertrainingcourse.component.css']
})
export class TeachertrainingcourseComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  teachertrainingcourseID = null;

  teachertrainingcourses = [];
  teachertrainingcoursesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.teachertrainingcourses = JSON.parse(window.sessionStorage.getItem('teachertrainingcourses'));
    this.teachertrainingcoursesAll = JSON.parse(window.sessionStorage.getItem('teachertrainingcoursesAll'));

    if (this.teachertrainingcourses == null) {
      this.teachertrainingcourseGet();
    } 
    
    if (this.teachertrainingcoursesAll == null) {
      this.teachertrainingcourseGetAll();
    }
  }

  teachertrainingcourseGet(){
    this.lookupservice.lookup("TEACHERTRAININGCOURSE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.teachertrainingcourses = response;
          window.sessionStorage.setItem("teachertrainingcourses", JSON.stringify(this.teachertrainingcourses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  teachertrainingcourseGetAll(){
    this.lookupservice.lookupAll("TEACHERTRAININGCOURSE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.teachertrainingcoursesAll = response;
          window.sessionStorage.setItem("teachertrainingcoursesAll", JSON.stringify(this.teachertrainingcoursesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}