
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  subjectID = null;

  subjects = [];
  subjectsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.subjects = JSON.parse(window.sessionStorage.getItem('subjects'));
    this.subjectsAll = JSON.parse(window.sessionStorage.getItem('subjectsAll'));

    if (this.subjects == null) {
      this.subjectGet();
    } 
    
    if (this.subjectsAll == null) {
      this.subjectGetAll();
    }
  }

  subjectGet(){
    this.lookupservice.lookup("SUBJECT").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.subjects = response;
          window.sessionStorage.setItem("subjects", JSON.stringify(this.subjects));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  subjectGetAll(){
    this.lookupservice.lookupAll("SUBJECT").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.subjectsAll = response;
          window.sessionStorage.setItem("subjectsAll", JSON.stringify(this.subjectsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}