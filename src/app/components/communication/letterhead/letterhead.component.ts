import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ApplicationComponent } from '../../userlogin/application/application.component';
import { LetterheadService } from './letterhead.service';

@Component({
  selector: 'app-letterhead',
  templateUrl: './letterhead.component.html',
  styleUrls: ['./letterhead.component.css']
})
export class LetterheadComponent implements OnInit {
  @ViewChild("application") application: ApplicationComponent;
  @ViewChild("addapplication") addapplication: ApplicationComponent;
  @ViewChild("editapplication") editapplication: ApplicationComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  applicationDisabled: boolean = true;
  @Input()
  all: boolean = false;
  @Input()
  applicationID = null;
  @Input()
  letterheadID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  letterheads = [];
  letterheadsAll = [];
  letterhead = {
    letterhead_ID: 0,
    application_ID:0,
    letterhead_CODE: "",
    letterhead_DESC: "",
    isactive:true,
  }
 
  constructor(
    private letterheadservice: LetterheadService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.letterheads = JSON.parse(window.sessionStorage.getItem('letterheads'));
    this.letterheadsAll = JSON.parse(window.sessionStorage.getItem('letterheadsAll'));
    if (this.view == 1 && this.disabled == false && this.letterheads == null) {
      this.letterheadGet();
    } else if (this.view == 1 && this.disabled == true && this.letterheadsAll == null) {
      this.letterheadGetAll();
    } else if (this. view == 2 && this.letterheadsAll == null) {
      this.letterheadGetAll();
    }

    if (this.letterheadID != 0 && !this.letterheadID && Number(window.sessionStorage.getItem('letterhead'))>0) {
      this.letterheadID = Number(window.sessionStorage.getItem('letterhead'));
    }  else if (this. view == 22 && (this.applicationID != null )) {
      this.letterheadAdvancedSearchAll(this.applicationID);
    }
    
    if (this.view == 5 && this.letterheadID) {
      window.sessionStorage.setItem("letterhead", this.letterheadID);
      this.letterheadGetOne(this.letterheadID);
    }
    
    if (this.view == 11 && this.applicationID && this.disabled == false) {
      this.letterheadAdvancedSearch(this.applicationID);
    } else if (this.view == 11 && this.applicationID && this.disabled == true) {
      this.letterheadAdvancedSearchAll(this.applicationID);
      
    } else if (this.view == 11) {
      this.letterheadID = null;
      this.letterheadsAll = null;
      this.letterheads = null;
    }

    // if (this.letterheadID == 0) {
    //   this.loginuserDisabled = false;
    //   this.letterheadID = null;
    // }

  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.letterheadGetAll.bind(this),
        },
      }
    );
  }

  onToolbarPreparingAdvanced(e) {
    console.log("onToolbarPreparingAdvanced");
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.letterheadAdvancedSearchAll.bind(this, this.applicationID),
        },
      }
    );
  }

  add() {
    this.letterhead = {
      letterhead_ID: 0,
      application_ID:0,
      letterhead_CODE: "",
      letterhead_DESC: "",
      isactive:true,
    };
  }

  update(row) {
    this.edit.next(row);
  }

  editView() {
    this.disabled = false;
  }

  showView(row) {
    this.show.next(row);
  }

  cancelView() {
    this.cancel.next();
  }

  letterheadEdit(){
    this.disabled = false;
  }

  letterheadCancel() {
    this.disabled = true;
    if (this.letterhead.letterhead_ID==0) {
      this.router.navigate(["/home/letterheads"], {});
    }
  }

  setLetterhead(response) {
 
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.letterhead = response;
  }

  setLetterheads(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.letterheads = response;
      window.sessionStorage.setItem("letterheads", JSON.stringify(this.letterheads));
    } else {
      this.letterheadsAll = response;
      window.sessionStorage.setItem("letterheadsAll", JSON.stringify(this.letterheadsAll));
    }
    this.cancel.next();
  }

  letterheadGet() {
    this.letterheadservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLetterheads(this.letterheadservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  letterheadGetAll() {
    this.letterheadservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLetterheads(this.letterheadservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  letterheadGetOne(id) {
    this.disabled = true;
    this.letterheadservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLetterhead(this.letterheadservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  letterheadAdd(letterhead) {
    letterhead.isactive="Y";

    if(this.view == 5){
      letterhead.application_ID = this.application.applicationID;
    }else{ 
      letterhead.application_ID = this.addapplication.applicationID;
    }

    this.letterheadservice.add(letterhead).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.letterhead_ID) {
          this.toastrservice.success("Success", "New letterhead Added");
          this.letterheadGetAll();
          this.setLetterhead(this.letterheadservice.getDetail(response));
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  letterheadUpdate(letterhead) {
     if(this.view == 5){
      letterhead.application_ID = this.application.applicationID;
    }else{ 
      letterhead.application_ID = this.editapplication.applicationID;
    }
    
    if (letterhead.isactive == true) {
      letterhead.isactive = "Y";
    } else {
      letterhead.isactive = "N";
    }
    this.letterheadservice.update(letterhead, letterhead.letterhead_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.letterhead_ID) {
          this.toastrservice.success("Success", " letterhead Updated");
          this.letterheadGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  letterheadSearch(str) {
    var search = {
      search: str
    }
    this.letterheadservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLetterheads(this.letterheadservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  letterheadSearchAll(str) {
    var search = {
      search: str
    }
    this.letterheadservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLetterheads(this.letterheadservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  letterheadAdvancedSearch(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.letterheadservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLetterheads(this.letterheadservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  letterheadAdvancedSearchAll(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.letterheadservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLetterheads(this.letterheadservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}