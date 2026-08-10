
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-careerlevel',
  templateUrl: './careerlevel.component.html',
  styleUrls: ['./careerlevel.component.css']
})
export class CareerlevelComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  careerlevelID = null;

  careerlevels = [];
  careerlevelsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.careerlevels = JSON.parse(window.sessionStorage.getItem('careerlevels'));
    this.careerlevelsAll = JSON.parse(window.sessionStorage.getItem('careerlevelsAll'));
    if (this.disabled == false && this.careerlevels == null) {
      this.careerlevelGet();
    } else if (this.disabled == true && this.careerlevelsAll == null) {
      this.careerlevelGetAll();
    }
  }

  setCareerlevels(response) {
    if (this.disabled == false) {
      this.careerlevels = response;
      window.sessionStorage.setItem("careerlevels", JSON.stringify(this.careerlevels));
    } else {
      this.careerlevelsAll = response;
      window.sessionStorage.setItem("careerlevelsAll", JSON.stringify(this.careerlevelsAll));
    }
  }

  careerlevelGet(){
    this.lookupservice.lookup("CAREERLEVEL").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCareerlevels(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  careerlevelGetAll(){
    this.lookupservice.lookupAll("CAREERLEVEL").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCareerlevels(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}