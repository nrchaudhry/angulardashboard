
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-worktype',
  templateUrl: './worktype.component.html',
  styleUrls: ['./worktype.component.css']
})
export class WorktypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  worktypeID = null;

  worktypes = [];
  worktypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.worktypes = JSON.parse(window.sessionStorage.getItem('worktypes'));
    this.worktypesAll = JSON.parse(window.sessionStorage.getItem('worktypesAll'));
    if (this.disabled == false && this.worktypes == null) {
      this.worktypeGet();
    } else if (this.disabled == true && this.worktypesAll == null) {
      this.worktypeGetAll();
    }
  }

  setWorktypes(response) {
    if (this.disabled == false) {
      this.worktypes = response;
      window.sessionStorage.setItem("worktypes", JSON.stringify(this.worktypes));
    } else {
      this.worktypesAll = response;
      window.sessionStorage.setItem("worktypesAll", JSON.stringify(this.worktypesAll));
    }
  }

  worktypeGet(){
    this.lookupservice.lookup("WORKTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setWorktypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  worktypeGetAll(){
    this.lookupservice.lookupAll("WORKTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setWorktypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}