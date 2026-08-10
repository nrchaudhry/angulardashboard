
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-regulatorybody',
  templateUrl: './regulatorybody.component.html',
  styleUrls: ['./regulatorybody.component.css']
})
export class RegulatorybodyComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  regulatorybodyID = null;

  regulatorybodies = [];
  regulatorybodiesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.regulatorybodies = JSON.parse(window.sessionStorage.getItem('regulatorybodies'));
    this.regulatorybodiesAll = JSON.parse(window.sessionStorage.getItem('regulatorybodiesAll'));
    if (this.disabled == false && this.regulatorybodies == null) {
      this.regulatorybodyGet();
    } else if (this.disabled == true && this.regulatorybodiesAll == null) {
      this.regulatorybodyGetAll();
    }
  }

  setRegulatorybodies(response) {
    if (this.disabled == false) {
      this.regulatorybodies = response;
      window.sessionStorage.setItem("regulatorybodies", JSON.stringify(this.regulatorybodies));
    } else {
      this.regulatorybodiesAll = response;
      window.sessionStorage.setItem("regulatorybodiesAll", JSON.stringify(this.regulatorybodiesAll));
    }
  }

  regulatorybodyGet(){
    this.lookupservice.lookup("REGULATORYBODY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setRegulatorybodies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  regulatorybodyGetAll(){
    this.lookupservice.lookupAll("REGULATORYBODY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setRegulatorybodies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}