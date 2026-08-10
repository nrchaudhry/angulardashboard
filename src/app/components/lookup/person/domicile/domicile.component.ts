
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-domicile',
  templateUrl: './domicile.component.html',
  styleUrls: ['./domicile.component.css']
})
export class DomicileComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  domicileID = null;

  domiciles = [];
  domicilesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.domiciles = JSON.parse(window.sessionStorage.getItem('domiciles'));
    this.domicilesAll = JSON.parse(window.sessionStorage.getItem('domicilesAll'));
    if (this.disabled == false && this.domiciles == null) {
      this.domicileGet();
    } else if (this.disabled == true && this.domicilesAll == null) {
      this.domicileGetAll();
    }
  }

  setDomiciles(response) {
    if (this.disabled == false) {
      this.domiciles = response;
      window.sessionStorage.setItem("domiciles", JSON.stringify(this.domiciles));
    } else {
      this.domicilesAll = response;
      window.sessionStorage.setItem("domicilesAll", JSON.stringify(this.domicilesAll));
    }
  }

  domicileGet(){
    this.lookupservice.lookup("DOMICILE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setDomiciles(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  domicileGetAll(){
    this.lookupservice.lookupAll("DOMICILE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setDomiciles(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}