
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-coursefeeplan',
  templateUrl: './coursefeeplan.component.html',
  styleUrls: ['./coursefeeplan.component.css']
})
export class CoursefeeplanComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  coursefeeplanID = null;

  coursefeeplans = [];
  coursefeeplansAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.coursefeeplans = JSON.parse(window.sessionStorage.getItem('coursefeeplans'));
    this.coursefeeplansAll = JSON.parse(window.sessionStorage.getItem('coursefeeplansAll'));

    if (this.coursefeeplans == null) {
      this.coursefeeplanGet();
    } 
    
    if (this.coursefeeplansAll == null) {
      this.coursefeeplanGetAll();
    }
  }

  coursefeeplanGet(){
    this.lookupservice.lookup("COURSEFEEPLAN").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.coursefeeplans = response;
          window.sessionStorage.setItem("coursefeeplans", JSON.stringify(this.coursefeeplans));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coursefeeplanGetAll(){
    this.lookupservice.lookupAll("COURSEFEEPLAN").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.coursefeeplansAll = response;
          window.sessionStorage.setItem("coursefeeplansAll", JSON.stringify(this.coursefeeplansAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}