
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-qualificationtype',
  templateUrl: './qualificationtype.component.html',
  styleUrls: ['./qualificationtype.component.css']
})
export class QualificationtypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  qualificationtypeID = null;

  qualificationtypes = [];
  qualificationtypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.qualificationtypes = JSON.parse(window.sessionStorage.getItem('qualificationtypes'));
    this.qualificationtypesAll = JSON.parse(window.sessionStorage.getItem('qualificationtypesAll'));

    if (this.qualificationtypes == null) {
      this.qualificationtypeGet();
    } 
    
    if (this.qualificationtypesAll == null) {
      this.qualificationtypeGetAll();
    }
  }

  qualificationtypeGet(){
    this.lookupservice.lookup("QUALIFICATIONTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.qualificationtypes = response;
          window.sessionStorage.setItem("qualificationtypes", JSON.stringify(this.qualificationtypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  qualificationtypeGetAll(){
    this.lookupservice.lookupAll("QUALIFICATIONTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.qualificationtypesAll = response;
          window.sessionStorage.setItem("qualificationtypesAll", JSON.stringify(this.qualificationtypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}