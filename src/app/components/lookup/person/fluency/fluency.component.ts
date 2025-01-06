
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-fluency',
  templateUrl: './fluency.component.html',
  styleUrls: ['./fluency.component.css']
})
export class FluencyComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  fluencyID = null;

  fluencies = [];
  fluenciesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.fluencies = JSON.parse(window.sessionStorage.getItem('fluencies'));
    this.fluenciesAll = JSON.parse(window.sessionStorage.getItem('fluenciesAll'));
    if (this.disabled == false && this.fluencies == null) {
      this.fluencyGet();
    } else if (this.disabled == true && this.fluenciesAll == null) {
      this.fluencyGetAll();
    }
  }

  setFluencies(response) {
    if (this.disabled == false) {
      this.fluencies = response;
      window.sessionStorage.setItem("fluencies", JSON.stringify(this.fluencies));
    } else {
      this.fluenciesAll = response;
      window.sessionStorage.setItem("fluenciesAll", JSON.stringify(this.fluenciesAll));
    }
  }

  fluencyGet(){
    this.lookupservice.lookup("FLUENCY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setFluencies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  fluencyGetAll(){
    this.lookupservice.lookupAll("FLUENCY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setFluencies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}