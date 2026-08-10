
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-workfield',
  templateUrl: './workfield.component.html',
  styleUrls: ['./workfield.component.css']
})
export class WorkfieldComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  workfieldID = null;

  workfields = [];
  workfieldsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.workfields = JSON.parse(window.sessionStorage.getItem('workfields'));
    this.workfieldsAll = JSON.parse(window.sessionStorage.getItem('workfieldsAll'));
    if (this.disabled == false && this.workfields == null) {
      this.workfieldGet();
    } else if (this.disabled == true && this.workfieldsAll == null) {
      this.workfieldGetAll();
    }
  }

  setWorkfields(response) {
    if (this.disabled == false) {
      this.workfields = response;
      window.sessionStorage.setItem("workfields", JSON.stringify(this.workfields));
    } else {
      this.workfieldsAll = response;
      window.sessionStorage.setItem("workfieldsAll", JSON.stringify(this.workfieldsAll));
    }
  }

  workfieldGet(){
    this.lookupservice.lookup("WORKFIELD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setWorkfields(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  workfieldGetAll(){
    this.lookupservice.lookupAll("WORKFIELD").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setWorkfields(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}