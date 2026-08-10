
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-ethnic',
  templateUrl: './ethnic.component.html',
  styleUrls: ['./ethnic.component.css']
})
export class EthnicComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  ethnicID = null;

  ethnics = [];
  ethnicsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.ethnics = JSON.parse(window.sessionStorage.getItem('ethnics'));
    this.ethnicsAll = JSON.parse(window.sessionStorage.getItem('ethnicsAll'));
    if (this.disabled == false && this.ethnics == null) {
      this.ethnicGet();
    } else if (this.disabled == true && this.ethnicsAll == null) {
      this.ethnicGetAll();
    }
  }

  setEthnics(response) {
    if (this.disabled == false) {
      this.ethnics = response;
      window.sessionStorage.setItem("ethnics", JSON.stringify(this.ethnics));
    } else {
      this.ethnicsAll = response;
      window.sessionStorage.setItem("ethnicsAll", JSON.stringify(this.ethnicsAll));
    }
  }

  ethnicGet(){
    this.lookupservice.lookup("ETHNIC").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEthnics(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  ethnicGetAll(){
    this.lookupservice.lookupAll("ETHNIC").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEthnics(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}