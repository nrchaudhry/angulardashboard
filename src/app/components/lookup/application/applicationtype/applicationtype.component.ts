
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-applicationtype',
  templateUrl: './applicationtype.component.html',
  styleUrls: ['./applicationtype.component.css']
})
export class ApplicationtypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  applicationtypeID = null;

  applicationtypes = [];
  applicationtypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.applicationtypes = JSON.parse(window.sessionStorage.getItem('applicationtypes'));
    this.applicationtypesAll = JSON.parse(window.sessionStorage.getItem('applicationtypesAll'));

    if (this.applicationtypes == null) {
      this.applicationtypeGet();
    }

    if (this.applicationtypesAll == null) {
      this.applicationtypeGetAll();
    }
  }

  applicationtypeGet() {
    this.lookupservice.lookup("APPLICATIONTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.applicationtypes = response;
          window.sessionStorage.setItem("applicationtypes", JSON.stringify(this.applicationtypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationtypeGetAll() {
    this.lookupservice.lookupAll("APPLICATIONTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.applicationtypesAll = response;
          window.sessionStorage.setItem("applicationtypesAll", JSON.stringify(this.applicationtypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
