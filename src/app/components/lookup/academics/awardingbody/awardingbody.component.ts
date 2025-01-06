
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-awardingbody',
  templateUrl: './awardingbody.component.html',
  styleUrls: ['./awardingbody.component.css']
})
export class AwardingbodyComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  awardingbodyID = null;

  awardingbodies = [];
  awardingbodiesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.awardingbodies = JSON.parse(window.sessionStorage.getItem('awardingbodies'));
    this.awardingbodiesAll = JSON.parse(window.sessionStorage.getItem('awardingbodiesAll'));

    if (this.awardingbodies == null) {
      this.awardingbodyGet();
    } 
    
    if (this.awardingbodiesAll == null) {
      this.awardingbodyGetAll();
    }
  }

  awardingbodyGet(){
    this.lookupservice.lookup("AWARDINGBODY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.awardingbodies = response;
          window.sessionStorage.setItem("awardingbodies", JSON.stringify(this.awardingbodies));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  awardingbodyGetAll(){
    this.lookupservice.lookupAll("AWARDINGBODY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.awardingbodiesAll = response;
          window.sessionStorage.setItem("awardingbodiesAll", JSON.stringify(this.awardingbodiesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}