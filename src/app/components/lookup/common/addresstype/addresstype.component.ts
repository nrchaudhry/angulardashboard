
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-addresstype',
  templateUrl: './addresstype.component.html',
  styleUrls: ['./addresstype.component.css']
})
export class AddresstypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  addresstypeID = null;

  addresstypes = [];
  addresstypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.addresstypes = JSON.parse(window.sessionStorage.getItem('addresstypes'));
    this.addresstypesAll = JSON.parse(window.sessionStorage.getItem('addresstypesAll'));

    if (this.addresstypes == null) {
      this.addresstypeGet();
    } 
    
    if (this.addresstypesAll == null) {
      this.addresstypeGetAll();
    }
  }

  addresstypeGet(){
    this.lookupservice.lookup("ADDRESSTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.addresstypes = response;
          window.sessionStorage.setItem("addresstypes", JSON.stringify(this.addresstypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  addresstypeGetAll(){
    this.lookupservice.lookupAll("ADDRESSTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.addresstypesAll = response;
          window.sessionStorage.setItem("addresstypesAll", JSON.stringify(this.addresstypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}