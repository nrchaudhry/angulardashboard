
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-residential',
  templateUrl: './residential.component.html',
  styleUrls: ['./residential.component.css']
})
export class ResidentialComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  residentialID = null;

  residentials = [];
  residentialsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.residentials = JSON.parse(window.sessionStorage.getItem('residentials'));
    this.residentialsAll = JSON.parse(window.sessionStorage.getItem('residentialsAll'));
    if (this.disabled == false && this.residentials == null) {
      this.residentialGet();
    } else if (this.disabled == true && this.residentialsAll == null) {
      this.residentialGetAll();
    }
  }

  setResidentials(response) {
    if (this.disabled == false) {
      this.residentials = response;
      window.sessionStorage.setItem("residentials", JSON.stringify(this.residentials));
    } else {
      this.residentialsAll = response;
      window.sessionStorage.setItem("residentialsAll", JSON.stringify(this.residentialsAll));
    }
  }

  residentialGet(){
    this.lookupservice.lookup("RESIDENTIAL").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setResidentials(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  residentialGetAll(){
    this.lookupservice.lookupAll("RESIDENTIAL").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setResidentials(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}