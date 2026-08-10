import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LookupService } from 'src/app/services/lookup.service';
import { OnFailService } from 'src/app/services/on-fail.service';

@Component({
  selector: 'app-filetype',
  templateUrl: './filetype.component.html',
  styleUrls: ['./filetype.component.css']
})
export class FiletypeComponent implements OnInit {
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  filetypeID = null;

  filetypes = [];
  filetypesAll = [];

  constructor(
    private lookupservice: LookupService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
    this.filetypes = JSON.parse(window.sessionStorage.getItem('filetypes'));
    this.filetypesAll = JSON.parse(window.sessionStorage.getItem('filetypesAll'));
    if (this.disabled == false && this.filetypes == null) {
      this.filetypeGet();
    } else if (this.disabled == true && this.filetypesAll == null) {
      this.filetypeGetAll();
    }
  }

  setFiletypes(response) {
      this.filetypes = response;
      window.sessionStorage.setItem("filetypes", JSON.stringify(this.filetypes));
  
      this.filetypesAll = response;
      window.sessionStorage.setItem("filetypesAll", JSON.stringify(this.filetypesAll));
    }

  filetypeGet(){
    this.lookupservice.lookup("FILETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setFiletypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  filetypeGetAll(){
    this.lookupservice.lookupAll("FILETYPE").subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setFiletypes(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
