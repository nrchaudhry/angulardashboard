
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-courseaim',
  templateUrl: './courseaim.component.html',
  styleUrls: ['./courseaim.component.css']
})
export class CourseaimComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  courseaimID = null;

  courseaims = [];
  courseaimsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.courseaims = JSON.parse(window.sessionStorage.getItem('courseaims'));
    this.courseaimsAll = JSON.parse(window.sessionStorage.getItem('courseaimsAll'));

    if (this.courseaims == null) {
      this.courseaimGet();
    } 
    
    if (this.courseaimsAll == null) {
      this.courseaimGetAll();
    }
  }

  courseaimGet(){
    this.lookupservice.lookup("courseaim").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.courseaims = response;
          window.sessionStorage.setItem("courseaims", JSON.stringify(this.courseaims));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  courseaimGetAll(){
    this.lookupservice.lookupAll("courseaim").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.courseaimsAll = response;
          window.sessionStorage.setItem("courseaimsAll", JSON.stringify(this.courseaimsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}