
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-collegetype',
  templateUrl: './collegetype.component.html',
  styleUrls: ['./collegetype.component.css']
})
export class CollegetypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  collegetypeID = null;

  collegetypes = [];
  collegetypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.collegetypes = JSON.parse(window.sessionStorage.getItem('collegetypes'));
    this.collegetypesAll = JSON.parse(window.sessionStorage.getItem('collegetypesAll'));

    if (this.collegetypes == null) {
      this.collegetypeGet();
    } 
    
    if (this.collegetypesAll == null) {
      this.collegetypeGetAll();
    }
  }

  collegetypeGet(){
    this.lookupservice.lookup("collegetype").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.collegetypes = response;
          window.sessionStorage.setItem("collegetypes", JSON.stringify(this.collegetypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  collegetypeGetAll(){
    this.lookupservice.lookupAll("collegetype").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.collegetypesAll = response;
          window.sessionStorage.setItem("collegetypesAll", JSON.stringify(this.collegetypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}