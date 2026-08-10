
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-weekday',
  templateUrl: './weekday.component.html',
  styleUrls: ['./weekday.component.css']
})
export class WeekdayComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  weekdayID = null;

  weekdays = [];
  weekdaysAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.weekdays = JSON.parse(window.sessionStorage.getItem('weekdays'));
    this.weekdaysAll = JSON.parse(window.sessionStorage.getItem('weekdaysAll'));
    if (this.disabled == false && this.weekdays == null) {
      this.weekdayGet();
    } else if (this.disabled == true && this.weekdaysAll == null) {
      this.weekdayGetAll();
    }
  }

  setWeekdays(response) {
    if (this.disabled == false) {
      this.weekdays = response;
      window.sessionStorage.setItem("weekdays", JSON.stringify(this.weekdays));
    } else {
      this.weekdaysAll = response;
      window.sessionStorage.setItem("weekdaysAll", JSON.stringify(this.weekdaysAll));
    }
  }

  weekdayGet(){
    this.lookupservice.lookup("WEEKDAY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setWeekdays(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  weekdayGetAll(){
    this.lookupservice.lookupAll("WEEKDAY").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setWeekdays(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}