
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-roomtype',
  templateUrl: './roomtype.component.html',
  styleUrls: ['./roomtype.component.css']
})
export class RoomtypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  roomtypeID = null;

  roomtypes = [];
  roomtypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.roomtypes = JSON.parse(window.sessionStorage.getItem('roomtypes'));
    this.roomtypesAll = JSON.parse(window.sessionStorage.getItem('roomtypesAll'));

    if (this.roomtypes == null) {
      this.roomtypeGet();
    }

    if (this.roomtypesAll == null) {
      this.roomtypeGetAll();
    }
  }

  roomtypeGet() {
    this.lookupservice.lookup("ROOMTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.roomtypes = response;
          window.sessionStorage.setItem("roomtypes", JSON.stringify(this.roomtypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  roomtypeGetAll() {
    this.lookupservice.lookupAll("ROOMTYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.roomtypesAll = response;
          window.sessionStorage.setItem("roomtypesAll", JSON.stringify(this.roomtypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
