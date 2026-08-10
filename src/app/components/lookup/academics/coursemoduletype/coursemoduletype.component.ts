
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-coursemoduletype',
  templateUrl: './coursemoduletype.component.html',
  styleUrls: ['./coursemoduletype.component.css']
})
export class CoursemoduletypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  coursemoduletypeID = null;

  coursemoduletypes = [];
  coursemoduletypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.coursemoduletypes = JSON.parse(window.sessionStorage.getItem('coursemoduletypes'));
    this.coursemoduletypesAll = JSON.parse(window.sessionStorage.getItem('coursemoduletypesAll'));

    if (this.coursemoduletypes == null) {
      this.coursemoduletypeGet();
    } 
    
    if (this.coursemoduletypesAll == null) {
      this.coursemoduletypeGetAll();
    }
  }

  coursemoduletypeGet(){
    this.lookupservice.lookup("COURSEMODULETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.coursemoduletypes = response;
          window.sessionStorage.setItem("coursemoduletypes", JSON.stringify(this.coursemoduletypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  coursemoduletypeGetAll(){
    this.lookupservice.lookupAll("COURSEMODULETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.coursemoduletypesAll = response;
          window.sessionStorage.setItem("coursemoduletypesAll", JSON.stringify(this.coursemoduletypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}