import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LettercategoryComponent } from '../lettercategory/lettercategory.component';
import { LetterheadComponent } from '../letterhead/letterhead.component';
import { EmailsettingComponent } from '../emailsetting/emailsetting.component';
import { LettertemplateService } from './lettertemplate.service';

@Component({
  selector: 'app-lettertemplate',
  templateUrl: './lettertemplate.component.html',
  styleUrls: ['./lettertemplate.component.css']
})
export class LettertemplateComponent implements OnInit {
  @ViewChild("letterhead") letterhead: LetterheadComponent;
  @ViewChild("addletterhead") addletterhead: LetterheadComponent;
  @ViewChild("editletterhead") editletterhead: LetterheadComponent;

  @ViewChild("lettercategory") lettercategory: LettercategoryComponent;
  @ViewChild("addlettercategory") addlettercategory: LettercategoryComponent;
  @ViewChild("editlettercategory") editlettercategory: LettercategoryComponent;

  @ViewChild("emailsetting") emailsetting: EmailsettingComponent;
  @ViewChild("addemailsetting") addemailsetting: EmailsettingComponent;
  @ViewChild("editemailsetting") editemailsetting: EmailsettingComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  letterheadDisabled: boolean = true;
  @Input()
  lettercategoryDisabled: boolean = true;
  @Input()
  emailsettingDisabled: boolean = true;
  @Input()
  all: boolean = false;
  @Input()
  letterheadID = null;
  @Input()
  letterID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  lettertemplates = [];
  lettertemplatesAll = [];
  lettertemplate = {
      letter_ID: 0,
      letterhead_ID: 0,
      lettercategory_ID: 0,
      emailsetting_ID: 0,
      letter_CODE: "",
      letter_TITLE: "",
      letter_SUBJECT: "",
      letter_TEXT: "",
      letter_PARAMETERS:"",
      isactive:true,
  }
 
  constructor(
    private lettertemplateservice: LettertemplateService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.lettertemplates = JSON.parse(window.sessionStorage.getItem('lettertemplates'));
    this.lettertemplatesAll = JSON.parse(window.sessionStorage.getItem('lettertemplatesAll'));
    if (this.view == 1 && this.disabled == false && this.lettertemplates == null) {
      this.lettertemplateGet();
    } else if (this.view == 1 && this.disabled == true && this.lettertemplatesAll == null) {
      this.lettertemplateGetAll();
    } else if (this. view == 2 && this.lettertemplatesAll == null) {
      this.lettertemplateGetAll();
    }

    if (this.letterID != 0 && !this.letterID && Number(window.sessionStorage.getItem('lettertemplate'))>0) {
      this.letterID = Number(window.sessionStorage.getItem('lettertemplate'));
    }  else if (this. view == 22 && (this.letterheadID != null )) {
      this.lettertemplateAdvancedSearchAll(this.letterheadID);
    }
    
    if (this.view == 5 && this.letterID) {
      window.sessionStorage.setItem("lettertemplate", this.letterID);
      this.lettertemplateGetOne(this.letterID);
    }
    
    if (this.view == 11 && this.letterheadID && this.disabled == false) {
      this.lettertemplateAdvancedSearch(this.letterheadID);
    } else if (this.view == 11 && this.letterheadID && this.disabled == true) {
      this.lettertemplateAdvancedSearchAll(this.letterheadID);
      
    } else if (this.view == 11) {
      this.letterID = null;
      this.lettertemplatesAll = null;
      this.lettertemplates = null;
    }

    // if (this.letterID == 0) {
    //   this.letterheadDisabled = false;
    //   this.letterID = null;
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
          onClick: this.lettertemplateGetAll.bind(this),
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
          onClick: this.lettertemplateAdvancedSearchAll.bind(this, this.letterheadID),
        },
      }
    );
  }

  add() {
    this.lettertemplate = {
      letter_ID: 0,
      letterhead_ID: 0,
      lettercategory_ID: 0,
      emailsetting_ID: 0,
      letter_CODE: "",
      letter_TITLE: "",
      letter_SUBJECT: "",
      letter_TEXT: "",
      letter_PARAMETERS:"",
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

  lettertemplateEdit(){
    this.disabled = false;
  }

  lettertemplateCancel() {
    this.disabled = true;
    if (this.lettertemplate.letter_ID==0) {
      this.router.navigate(["/home/lettertemplates"], {});
    }
  }

  setLettertemplate(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.lettertemplate = response;
  }

  setLettertemplates(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.lettertemplates = response;
      window.sessionStorage.setItem("lettertemplates", JSON.stringify(this.lettertemplates));
    } else {
      this.lettertemplatesAll = response;
      window.sessionStorage.setItem("lettertemplatesAll", JSON.stringify(this.lettertemplatesAll));
    }
    this.cancel.next();
  }

  lettertemplateGet() {
    this.lettertemplateservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettertemplates(this.lettertemplateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettertemplateGetAll() {
    this.lettertemplateservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettertemplates(this.lettertemplateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettertemplateGetOne(id) {
    this.disabled = true;
    this.lettertemplateservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettertemplate(this.lettertemplateservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettertemplateAdd(lettertemplate) {
    lettertemplate.isactive="Y";

    if(this.view == 5){
      lettertemplate.lettercategory_ID = this.lettercategory.lettercategoryID;
      lettertemplate.letterhead_ID = this.letterhead.letterheadID;
      lettertemplate.emailsetting_ID = this.emailsetting.emailsettingID;
    }else{ 
      lettertemplate.lettercategory_ID = this.addlettercategory.lettercategoryID;
      lettertemplate.letterhead_ID = this.addletterhead.letterheadID;
      lettertemplate.emailsetting_ID = this.addemailsetting.emailsettingID;
    }

    this.lettertemplateservice.add(lettertemplate).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.letter_ID) {
          this.toastrservice.success("Success", "New Lettertemplate Added");
          this.lettertemplateGetAll();
          this.setLettertemplate(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettertemplateUpdate(lettertemplate) {
     if(this.view == 5){
      lettertemplate.lettercategory_ID = this.lettercategory.lettercategoryID;
      lettertemplate.letterhead_ID = this.letterhead.letterheadID;
      lettertemplate.emailsetting_ID = this.emailsetting.emailsettingID;
    }else{ 
      lettertemplate.lettercategory_ID = this.editlettercategory.lettercategoryID;
      lettertemplate.letterhead_ID = this.editletterhead.letterheadID;
      lettertemplate.emailsetting_ID = this.editemailsetting.emailsettingID;
    }
    if (lettertemplate.isactive == true) {
      lettertemplate.isactive = "Y";
    } else {
      lettertemplate.isactive = "N";
    }
    this.lettertemplateservice.update(lettertemplate, lettertemplate.letter_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.letter_ID) {
          this.toastrservice.success("Success", " Lettertemplate Updated");
         this.setLettertemplate(response);
         this.lettertemplateGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettertemplateSearch(str) {
    var search = {
      search: str
    }
    this.lettertemplateservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettertemplates(this.lettertemplateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettertemplateSearchAll(str) {
    var search = {
      search: str
    }
    this.lettertemplateservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettertemplates(this.lettertemplateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettertemplateAdvancedSearch(letterheadID) {
    this.letterheadID = letterheadID;
    var search = {
      letterhead_ID: letterheadID
    }
    this.lettertemplateservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettertemplates(this.lettertemplateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettertemplateAdvancedSearchAll(letterheadID) {
    this.letterheadID = letterheadID;
    var search = {
      letterhead_ID: letterheadID
    }
    this.lettertemplateservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettertemplates(this.lettertemplateservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}