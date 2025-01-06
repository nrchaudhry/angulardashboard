
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-disability',
  templateUrl: './disability.component.html',
  styleUrls: ['./disability.component.css']
})
export class DisabilityComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  disabilityID = null;

  disabilities = [];
  disabilitiesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.disabilities = JSON.parse(window.sessionStorage.getItem('disabilities'));
    this.disabilitiesAll = JSON.parse(window.sessionStorage.getItem('disabilitiesAll'));
    if (this.disabled == false && this.disabilities == null) {
      this.disabilityGet();
    } else if (this.disabled == true && this.disabilitiesAll == null) {
      this.disabilityGetAll();
    }
  }

  setDisabilities(response) {
    if (this.disabled == false) {
      this.disabilities = response;
      window.sessionStorage.setItem("disabilities", JSON.stringify(this.disabilities));
    } else {
      this.disabilitiesAll = response;
      window.sessionStorage.setItem("disabilitiesAll", JSON.stringify(this.disabilitiesAll));
    }
  }

  disabilityGet(){
    this.lookupservice.lookup("DISABILITY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setDisabilities(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  disabilityGetAll(){
    this.lookupservice.lookupAll("DISABILITY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setDisabilities(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}