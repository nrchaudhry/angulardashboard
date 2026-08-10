
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-companytype',
  templateUrl: './companytype.component.html',
  styleUrls: ['./companytype.component.css']
})
export class CompanytypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  companytypeID = null;

  companytypes = [];
  companytypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.companytypes = JSON.parse(window.sessionStorage.getItem('companytypes'));
    this.companytypesAll = JSON.parse(window.sessionStorage.getItem('companytypesAll'));

    if (this.companytypes == null) {
      this.companytypeGet();
    } 
    
    if (this.companytypesAll == null) {
      this.companytypeGetAll();
    }
  }

  companytypeGet(){
    this.lookupservice.lookup("COMPANYTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.companytypes = response;
          window.sessionStorage.setItem("companytypes", JSON.stringify(this.companytypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companytypeGetAll(){
    this.lookupservice.lookupAll("COMPANYTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.companytypesAll = response;
          window.sessionStorage.setItem("companytypesAll", JSON.stringify(this.companytypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}