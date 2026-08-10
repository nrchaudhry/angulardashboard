
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LoginusermailmessageComponent } from '../loginusermailmessage/loginusermailmessage.component';
import { LoginusermailmessageattachmentService } from './loginusermailmessageattachment.service';

@Component({
  selector: 'app-loginusermailmessageattachment',
  templateUrl: './loginusermailmessageattachment.component.html',
  styleUrls: ['./loginusermailmessageattachment.component.css']
})
export class LoginusermailmessageattachmentComponent implements OnInit {
  @ViewChild("loginusermailmessage") loginusermailmessage: LoginusermailmessageComponent;
  @ViewChild("addloginusermailmessage") addloginusermailmessage: LoginusermailmessageComponent;
  @ViewChild("editloginusermailmessage") editloginusermailmessage: LoginusermailmessageComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  loginusermailmessageDisabled: boolean = true;
  @Input()
  all: boolean = false;
  @Input()
  mailmessageID = null;
  @Input()
  mailmessageattachmentID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginusermailmessageattachments = [];
  loginusermailmessageattachmentsAll = [];
  loginusermailmessageattachment = {
      mailmessageattachment_ID: 0,
      mailmessage_ID: 0,
      mailmessageattachment_FILENAME: "",
      mailmessageattachment_PATH: "",
      isactive:true,
  }
 
  constructor(
    private loginusermailmessageattachmentservice: LoginusermailmessageattachmentService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginusermailmessageattachments = JSON.parse(window.sessionStorage.getItem('loginusermailmessageattachments'));
    this.loginusermailmessageattachmentsAll = JSON.parse(window.sessionStorage.getItem('loginusermailmessageattachmentsAll'));
    if (this.view == 1 && this.disabled == false && this.loginusermailmessageattachments == null) {
      this.loginusermailmessageattachmentGet();
    } else if (this.view == 1 && this.disabled == true && this.loginusermailmessageattachmentsAll == null) {
      this.loginusermailmessageattachmentGetAll();
    } else if (this. view == 2 && this.loginusermailmessageattachmentsAll == null) {
      this.loginusermailmessageattachmentGetAll();
    }

    if (this.mailmessageattachmentID != 0 && !this.mailmessageattachmentID && Number(window.sessionStorage.getItem('loginusermailmessageattachment'))>0) {
      this.mailmessageattachmentID = Number(window.sessionStorage.getItem('loginusermailmessageattachment'));
    }  else if (this. view == 22 && (this.mailmessageID != null )) {
      this.loginusermailmessageattachmentAdvancedSearchAll(this.mailmessageID);
    }
    
    if (this.view == 5 && this.mailmessageattachmentID) {
      window.sessionStorage.setItem("loginusermailmessageattachment", this.mailmessageattachmentID);
      this.loginusermailmessageattachmentGetOne(this.mailmessageattachmentID);
    }
    
    if (this.view == 11 && this.mailmessageID && this.disabled == false) {
      this.loginusermailmessageattachmentAdvancedSearch(this.mailmessageID);
    } else if (this.view == 11 && this.mailmessageID && this.disabled == true) {
      this.loginusermailmessageattachmentAdvancedSearchAll(this.mailmessageID);
      
    } else if (this.view == 11) {
      this.mailmessageattachmentID = null;
      this.loginusermailmessageattachmentsAll = null;
      this.loginusermailmessageattachments = null;
    }

    // if (this.mailmessageattachmentID == 0) {
    //   this.loginusermailmessageDisabled = false;
    //   this.mailmessageattachmentID = null;
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
          onClick: this.loginusermailmessageattachmentGetAll.bind(this),
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
          onClick: this.loginusermailmessageattachmentAdvancedSearchAll.bind(this, this.mailmessageID),
        },
      }
    );
  }

  add() {
    this.loginusermailmessageattachment = {
      mailmessageattachment_ID: 0,
      mailmessage_ID: 0,
      mailmessageattachment_FILENAME: "",
      mailmessageattachment_PATH: "",
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

  loginusermailmessageattachmentEdit(){
    this.disabled = false;
  }

  loginusermailmessageattachmentCancel() {
    this.disabled = true;
    if (this.loginusermailmessageattachment.mailmessageattachment_ID==0) {
      this.router.navigate(["/home/loginusemailmessageattachments"], {});
    }
  }

  setLoginusermailmessageattachment(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.loginusermailmessageattachment = response;
  }

  setLoginusermailmessageattachments(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginusermailmessageattachments = response;
      window.sessionStorage.setItem("loginusermailmessageattachments", JSON.stringify(this.loginusermailmessageattachments));
    } else {
      this.loginusermailmessageattachmentsAll = response;
      window.sessionStorage.setItem("loginusermailmessageattachmentsAll", JSON.stringify(this.loginusermailmessageattachmentsAll));
    }
    this.cancel.next();
  }

  loginusermailmessageattachmentGet() {
    this.loginusermailmessageattachmentservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessageattachments(this.loginusermailmessageattachmentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageattachmentGetAll() {
    this.loginusermailmessageattachmentservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessageattachments(this.loginusermailmessageattachmentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageattachmentGetOne(id) {
    this.disabled = true;
    this.loginusermailmessageattachmentservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessageattachment(this.loginusermailmessageattachmentservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageattachmentAdd(loginusermailmessageattachment) {
    loginusermailmessageattachment.isactive="Y";

    if(this.view == 5){
      loginusermailmessageattachment.mailmessage_ID = this.loginusermailmessage.mailmessageID;
    }else{ 
      loginusermailmessageattachment.mailmessage_ID = this.addloginusermailmessage.mailmessageID;
    }

    this.loginusermailmessageattachmentservice.add(loginusermailmessageattachment).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.mailmessageattachment_ID) {
          this.toastrservice.success("Success", "New Loginusermailmessageattachment Added");
          this.loginusermailmessageattachmentGetAll();
          this.setLoginusermailmessageattachment(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageattachmentUpdate(loginusermailmessageattachment) {
     if(this.view == 5){
      loginusermailmessageattachment.mailmessage_ID = this.loginusermailmessage.mailmessageID;
    }else{ 
      loginusermailmessageattachment.mailmessage_ID = this.editloginusermailmessage.mailmessageID;
    }
    if (loginusermailmessageattachment.isactive == true) {
      loginusermailmessageattachment.isactive = "Y";
    } else {
      loginusermailmessageattachment.isactive = "N";
    }
    this.loginusermailmessageattachmentservice.update(loginusermailmessageattachment, loginusermailmessageattachment.mailmessageattachment_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.mailmessageattachment_ID) {
          this.toastrservice.success("Success", " Loginusermailmessageattachment Updated");
          this.setLoginusermailmessageattachment(response);
          this.loginusermailmessageattachmentGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageattachmentSearch(str) {
    var search = {
      search: str
    }
    this.loginusermailmessageattachmentservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessageattachments(this.loginusermailmessageattachmentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageattachmentSearchAll(str) {
    var search = {
      search: str
    }
    this.loginusermailmessageattachmentservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessageattachments(this.loginusermailmessageattachmentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageattachmentAdvancedSearch(mailmessageID) {
    this.mailmessageID = mailmessageID;
    var search = {
      mailmessage_ID: mailmessageID
    }
    this.loginusermailmessageattachmentservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessageattachments(this.loginusermailmessageattachmentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageattachmentAdvancedSearchAll(mailmessageID) {
    this.mailmessageID = mailmessageID;
    var search = {
      mailmessage_ID: mailmessageID
    }
    this.loginusermailmessageattachmentservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessageattachments(this.loginusermailmessageattachmentservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}