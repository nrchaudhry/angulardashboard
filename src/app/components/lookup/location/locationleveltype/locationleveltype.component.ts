
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-locationleveltype',
  templateUrl: './locationleveltype.component.html',
  styleUrls: ['./locationleveltype.component.css']
})
export class LocationleveltypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  locationleveltypeID = null;

  locationleveltypes = [];
  locationleveltypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.locationleveltypes = JSON.parse(window.sessionStorage.getItem('locationleveltypes'));
    this.locationleveltypesAll = JSON.parse(window.sessionStorage.getItem('locationleveltypesAll'));
    if (this.locationleveltypes == null) {
      this.locationleveltypeGet();
    } 
    
    if (this.locationleveltypesAll == null) {
      this.locationleveltypeGetAll();
    }
  }

  setLocationstudies(response) {
    if (this.disabled == false) {
      this.locationleveltypes = response;
      window.sessionStorage.setItem("locationleveltypes", JSON.stringify(this.locationleveltypes));
    } else {
      this.locationleveltypesAll = response;
      window.sessionStorage.setItem("locationleveltypesAll", JSON.stringify(this.locationleveltypesAll));
    }
  }

  locationleveltypeGet(){
    this.lookupservice.lookup("LOCATIONLEVELTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLocationstudies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  locationleveltypeGetAll(){
    this.lookupservice.lookupAll("LOCATIONLEVELTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLocationstudies(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}