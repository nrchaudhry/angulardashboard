
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-coursemode',
  templateUrl: './coursemode.component.html',
  styleUrls: ['./coursemode.component.css']
})
export class CoursemodeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  coursemodeID = null;

  coursemodes = [];
  coursemodesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.coursemodes = JSON.parse(window.sessionStorage.getItem('coursemodes'));
    this.coursemodesAll = JSON.parse(window.sessionStorage.getItem('coursemodesAll'));
    if (this.disabled == false && this.coursemodes == null) {
      this.coursemodeGet();
    } else if (this.disabled == true && this.coursemodesAll == null) {
      this.coursemodeGetAll();
    }
  }

  setCoursemodes(response) {
    if (this.disabled == false) {
      this.coursemodes = response;
      window.sessionStorage.setItem("coursemodes", JSON.stringify(this.coursemodes));
    } else {
      this.coursemodesAll = response;
      window.sessionStorage.setItem("coursemodesAll", JSON.stringify(this.coursemodesAll));
    }
  }

  coursemodeGet(){
    this.lookupservice.lookup("COURSEMODE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCoursemodes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coursemodeGetAll(){
    this.lookupservice.lookupAll("COURSEMODE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCoursemodes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}