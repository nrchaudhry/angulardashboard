import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpCallServieService } from 'src/app/services/http-call-servie.service';

import { OnFailService } from 'src/app/services/on-fail.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-persontitle',
  templateUrl: './persontitle.component.html',
  styleUrls: ['./persontitle.component.css']
})
export class PersontitleComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  title = null;

  titles = [];

  constructor(
    private httpcallservieservice: HttpCallServieService,
  ) { }

  ngOnInit(): void {
    this.titles = JSON.parse(window.sessionStorage.getItem('titles'));
    if (this.titles == null) {
      this.titleGet();
    }
  }

  setTitles(response) {
    this.titles = response;
    window.sessionStorage.setItem("titles", JSON.stringify(this.titles));
  }

  titleGet(){
    this.httpcallservieservice.getTitle().subscribe(res => {
      if (res) {
        this.titles = res;
      }
    }, error => {
      return;
    } 
    );
  }
}
