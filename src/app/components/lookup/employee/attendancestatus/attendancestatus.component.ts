
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-attendancestatus',
  templateUrl: './attendancestatus.component.html',
  styleUrls: ['./attendancestatus.component.css']
})
export class AttendancestatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  attendancestatusID = null;

  attendancestatuses = [];
  attendancestatusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.attendancestatuses = JSON.parse(window.sessionStorage.getItem('attendancestatuses'));
    this.attendancestatusesAll = JSON.parse(window.sessionStorage.getItem('attendancestatusesAll'));
    if (this.disabled == false && this.attendancestatuses == null) {
      this.attendancestatusGet();
    } else if (this.disabled == true && this.attendancestatusesAll == null) {
      this.attendancestatusGetAll();
    }
  }

  setAttendancestatuses(response) {
    if (this.disabled == false) {
      this.attendancestatuses = response;
      window.sessionStorage.setItem("attendancestatuses", JSON.stringify(this.attendancestatuses));
    } else {
      this.attendancestatusesAll = response;
      window.sessionStorage.setItem("attendancestatusesAll", JSON.stringify(this.attendancestatusesAll));
    }
  }

  attendancestatusGet() {
    this.lookupservice.lookup("ATTENDANCESTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setAttendancestatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  attendancestatusGetAll() {
    this.lookupservice.lookupAll("ATTENDANCESTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setAttendancestatuses(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}