
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-companystatus',
  templateUrl: './companystatus.component.html',
  styleUrls: ['./companystatus.component.css']
})
export class CompanystatusComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  companystatusID = null;

  companystatuses = [];
  companystatusesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.companystatuses = JSON.parse(window.sessionStorage.getItem('companystatuses'));
    this.companystatusesAll = JSON.parse(window.sessionStorage.getItem('companystatusesAll'));

    if (this.companystatuses == null) {
      this.companystatusGet();
    } 
    
    if (this.companystatusesAll == null) {
      this.companystatusGetAll();
    }
  }

  companystatusGet(){
    this.lookupservice.lookup("COMPANYSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.companystatuses = response;
          window.sessionStorage.setItem("companystatuses", JSON.stringify(this.companystatuses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companystatusGetAll(){
    this.lookupservice.lookupAll("COMPANYSTATUS").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.companystatusesAll = response;
          window.sessionStorage.setItem("companystatusesAll", JSON.stringify(this.companystatusesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}