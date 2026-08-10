
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-referencecountry',
  templateUrl: './referencecountry.component.html',
  styleUrls: ['./referencecountry.component.css']
})
export class ReferencecountryComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  referencecountryID = null;

  referencecountries = [];
  referencecountriesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.referencecountries = JSON.parse(window.sessionStorage.getItem('referencecountries'));
    this.referencecountriesAll = JSON.parse(window.sessionStorage.getItem('referencecountriesAll'));
    if (this.disabled == false && this.referencecountries == null) {
      this.referencecountryGet();
    } else if (this.disabled == true && this.referencecountriesAll == null) {
      this.referencecountryGetAll();
    }
  }

  setReferencecountries(response) {
    if (this.disabled == false) {
      this.referencecountries = response;
      window.sessionStorage.setItem("referencecountries", JSON.stringify(this.referencecountries));
    } else {
      this.referencecountriesAll = response;
      window.sessionStorage.setItem("referencecountriesAll", JSON.stringify(this.referencecountriesAll));
    }
  }

  referencecountryGet(){
    this.lookupservice.lookup("REFERENCECOUNTRY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReferencecountries(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencecountryGetAll(){
    this.lookupservice.lookupAll("REFERENCECOUNTRY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setReferencecountries(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}