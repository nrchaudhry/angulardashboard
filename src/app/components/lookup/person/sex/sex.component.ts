
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-sex',
  templateUrl: './sex.component.html',
  styleUrls: ['./sex.component.css']
})
export class SexComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  sexID = null;

  sexes = [];
  sexesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.sexes = JSON.parse(window.sessionStorage.getItem('sexes'));
    this.sexesAll = JSON.parse(window.sessionStorage.getItem('sexesAll'));
    if (this.disabled == false && this.sexes == null) {
      this.sexGet();
    } else if (this.disabled == true && this.sexesAll == null) {
      this.sexGetAll();
    }
  }

  setSexes(response) {
    if (this.disabled == false) {
      this.sexes = response;
      window.sessionStorage.setItem("sexes", JSON.stringify(this.sexes));
    } else {
      this.sexesAll = response;
      window.sessionStorage.setItem("sexesAll", JSON.stringify(this.sexesAll));
    }
  }

  sexGet(){
    this.lookupservice.lookup("SEX").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSexes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  sexGetAll(){
    this.lookupservice.lookupAll("SEX").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSexes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}