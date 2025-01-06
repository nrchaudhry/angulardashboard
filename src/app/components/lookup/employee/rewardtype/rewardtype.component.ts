import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-rewardtype',
  templateUrl: './rewardtype.component.html',
  styleUrls: ['./rewardtype.component.css']
})
export class RewardtypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  rewardtypeID = null;

  rewardtypes = [];
  rewardtypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.rewardtypes = JSON.parse(window.sessionStorage.getItem('rewardtypes'));
    this.rewardtypesAll = JSON.parse(window.sessionStorage.getItem('rewardtypesAll'));
    if (this.disabled == false && this.rewardtypes == null) {
      this.rewardtypeGet();
    } else if (this.disabled == true && this.rewardtypesAll == null) {
      this.rewardtypeGetAll();
    }
  }

  setRewardtypes(response) {
    this.rewardtypes = response;
    window.sessionStorage.setItem("rewardtypes", JSON.stringify(this.rewardtypes));

    this.rewardtypesAll = response;
    window.sessionStorage.setItem("rewardtypesAll", JSON.stringify(this.rewardtypesAll));
  }

  rewardtypeGet() {
    this.lookupservice.lookup("REWARDTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setRewardtypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  rewardtypeGetAll() {
    this.lookupservice.lookupAll("REWARDTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setRewardtypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}