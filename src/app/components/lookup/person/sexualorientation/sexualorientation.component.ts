
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-sexualorientation',
  templateUrl: './sexualorientation.component.html',
  styleUrls: ['./sexualorientation.component.css']
})
export class SexualorientationComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  sexualorientationID = null;

  sexualorientations = [];
  sexualorientationsAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.sexualorientations = JSON.parse(window.sessionStorage.getItem('sexualorientations'));
    this.sexualorientationsAll = JSON.parse(window.sessionStorage.getItem('sexualorientationsAll'));
    if (this.disabled == false && this.sexualorientations == null) {
      this.sexualorientationGet();
    } else if (this.disabled == true && this.sexualorientationsAll == null) {
      this.sexualorientationGetAll();
    }
  }

  setSexualorientations(response) {
    if (this.disabled == false) {
      this.sexualorientations = response;
      window.sessionStorage.setItem("sexualorientations", JSON.stringify(this.sexualorientations));
    } else {
      this.sexualorientationsAll = response;
      window.sessionStorage.setItem("sexualorientationsAll", JSON.stringify(this.sexualorientationsAll));
    }
  }

  sexualorientationGet(){
    this.lookupservice.lookup("SEXUALORIENTATION").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSexualorientations(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  sexualorientationGetAll(){
    this.lookupservice.lookupAll("SEXUALORIENTATION").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSexualorientations(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}