import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LoginuserComponent } from '../../userlogin/loginuser/loginuser.component';
import { LoginusermailmessageComponent } from '../loginusermailmessage/loginusermailmessage.component';
import { LoginusermailmessagerecipientService } from './loginusermailmessagerecipient.service';

@Component({
  selector: 'app-loginusermailmessagerecipient',
  templateUrl: './loginusermailmessagerecipient.component.html',
  styleUrls: ['./loginusermailmessagerecipient.component.css']
})
export class LoginusermailmessagerecipientComponent implements OnInit {
  @ViewChild("loginusermailmessage") loginusermailmessage: LoginusermailmessageComponent;
  @ViewChild("addloginusermailmessage") addloginusermailmessage: LoginusermailmessageComponent;
  @ViewChild("editloginusermailmessage") editloginusermailmessage: LoginusermailmessageComponent;

  @ViewChild("loginuser") loginuser: LoginuserComponent;
  @ViewChild("addloginuser") addloginuser: LoginuserComponent;
  @ViewChild("editloginuser") editloginuser: LoginuserComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  loginusermailmessageDisabled: boolean = true;
  @Input()
  loginuserDisabled: boolean = true;
  @Input()
  all: boolean = false;
  @Input()
  mailmessageID = null;
  @Input()
  mailmessagerecipientID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginusermailmessagerecipients = [];
  loginusermailmessagerecipientsAll = [];
  loginusermailmessagerecipient = {
      mailmessagerecipient_ID: 0,
      mailmessage_ID: 0,
      user_ID: 0,
      student_ID: null,
      mailmessagerecipient_ASTYPE: "",
      isread: true,
      isactive:true,
  }
 
  constructor(
    private loginusermailmessagerecipientservice: LoginusermailmessagerecipientService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginusermailmessagerecipients = JSON.parse(window.sessionStorage.getItem('loginusermailmessagerecipients'));
    this.loginusermailmessagerecipientsAll = JSON.parse(window.sessionStorage.getItem('loginusermailmessagerecipientsAll'));
    if (this.view == 1 && this.disabled == false && this.loginusermailmessagerecipients == null) {
      this.loginusermailmessagerecipientGet();
    } else if (this.view == 1 && this.disabled == true && this.loginusermailmessagerecipientsAll == null) {
      this.loginusermailmessagerecipientGetAll();
    } else if (this. view == 2 && this.loginusermailmessagerecipientsAll == null) {
      this.loginusermailmessagerecipientGetAll();
    }

    if (this.mailmessagerecipientID != 0 && !this.mailmessagerecipientID && Number(window.sessionStorage.getItem('loginusermailmessagerecipient'))>0) {
      this.mailmessagerecipientID = Number(window.sessionStorage.getItem('loginusermailmessagerecipient'));
    }  else if (this. view == 22 && (this.mailmessageID != null )) {
      this.loginusermailmessagerecipientAdvancedSearchAll(this.mailmessageID);
    }
    
    if (this.view == 5 && this.mailmessagerecipientID) {
      window.sessionStorage.setItem("loginusermailmessagerecipient", this.mailmessagerecipientID);
      this.loginusermailmessagerecipientGetOne(this.mailmessagerecipientID);
    }
    
    if (this.view == 11 && this.mailmessageID && this.disabled == false) {
      this.loginusermailmessagerecipientAdvancedSearch(this.mailmessageID);
    } else if (this.view == 11 && this.mailmessageID && this.disabled == true) {
      this.loginusermailmessagerecipientAdvancedSearchAll(this.mailmessageID);
      
    } else if (this.view == 11) {
      this.mailmessagerecipientID = null;
      this.loginusermailmessagerecipientsAll = null;
      this.loginusermailmessagerecipients = null;
    }

    // if (this.mailmessagerecipientID == 0) {
    //   this.loginusermailmessageDisabled = false;
    //   this.mailmessagerecipientID = null;
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
          onClick: this.loginusermailmessagerecipientGetAll.bind(this),
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
          onClick: this.loginusermailmessagerecipientAdvancedSearchAll.bind(this, this.mailmessageID),
        },
      }
    );
  }

  add() {
    this.loginusermailmessagerecipient = {
      mailmessagerecipient_ID: 0,
      mailmessage_ID: 0,
      user_ID: 0,
      student_ID: null,
      mailmessagerecipient_ASTYPE: "",
      isread: true,
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

  loginusermailmessagerecipientEdit(){
    this.disabled = false;
  }

  loginusermailmessagerecipientCancel() {
    this.disabled = true;
    if (this.loginusermailmessagerecipient.mailmessagerecipient_ID==0) {
      this.router.navigate(["/home/loginusemailmessagerecipients"], {});
    }
  }

  setLoginusermailmessagerecipient(response) {
    if (response.isread == "Y") {
      response.isread = true;
    } else {
      response.isread = false;
    }
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.loginusermailmessagerecipient = response;
  }

  setLoginusermailmessagerecipients(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginusermailmessagerecipients = response;
      window.sessionStorage.setItem("loginusermailmessagerecipients", JSON.stringify(this.loginusermailmessagerecipients));
    } else {
      this.loginusermailmessagerecipientsAll = response;
      window.sessionStorage.setItem("loginusermailmessagerecipientsAll", JSON.stringify(this.loginusermailmessagerecipientsAll));
    }
    this.cancel.next();
  }

  loginusermailmessagerecipientGet() {
    this.loginusermailmessagerecipientservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagerecipients(this.loginusermailmessagerecipientservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagerecipientGetAll() {
    this.loginusermailmessagerecipientservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagerecipients(this.loginusermailmessagerecipientservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagerecipientGetOne(id) {
    this.disabled = true;
    this.loginusermailmessagerecipientservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagerecipient(this.loginusermailmessagerecipientservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagerecipientAdd(loginusermailmessagerecipient) {
    loginusermailmessagerecipient.isread="Y";
    loginusermailmessagerecipient.isactive="Y";

    if(this.view == 5){
      loginusermailmessagerecipient.user_ID = this.loginuser.userID;
      loginusermailmessagerecipient.mailmessage_ID = this.loginusermailmessage.mailmessageID;
    }else{ 
      loginusermailmessagerecipient.user_ID = this.addloginuser.userID;
      loginusermailmessagerecipient.mailmessage_ID = this.addloginusermailmessage.mailmessageID;
    }

    this.loginusermailmessagerecipientservice.add(loginusermailmessagerecipient).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.mailmessagerecipient_ID) {
          this.toastrservice.success("Success", "New Loginusermailmessagerecipient Added");
          this.loginusermailmessagerecipientGetAll();
          this.setLoginusermailmessagerecipient(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagerecipientUpdate(loginusermailmessagerecipient) {
     if(this.view == 5){
      loginusermailmessagerecipient.user_ID = this.loginuser.userID;
      loginusermailmessagerecipient.mailmessage_ID = this.loginusermailmessage.mailmessageID;
    }else{ 
      loginusermailmessagerecipient.user_ID = this.editloginuser.userID;
      loginusermailmessagerecipient.mailmessage_ID = this.editloginusermailmessage.mailmessageID;
    }
    if (loginusermailmessagerecipient.isread == true) {
      loginusermailmessagerecipient.isread = "Y";
    } else {
      loginusermailmessagerecipient.isread = "N";
    }
    if (loginusermailmessagerecipient.isactive == true) {
      loginusermailmessagerecipient.isactive = "Y";
    } else {
      loginusermailmessagerecipient.isactive = "N";
    }
    this.loginusermailmessagerecipientservice.update(loginusermailmessagerecipient, loginusermailmessagerecipient.mailmessagerecipient_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.mailmessagerecipient_ID) {
          this.toastrservice.success("Success", " Loginusermailmessagerecipient Updated");
          if (this.disabled==true) {
            this.setLoginusermailmessagerecipient(response);
          } else {
            this.disabled = true;
          }
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagerecipientSearch(str) {
    var search = {
      search: str
    }
    this.loginusermailmessagerecipientservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagerecipients(this.loginusermailmessagerecipientservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagerecipientSearchAll(str) {
    var search = {
      search: str
    }
    this.loginusermailmessagerecipientservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagerecipients(this.loginusermailmessagerecipientservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagerecipientAdvancedSearch(mailmessageID) {
    this.mailmessageID = mailmessageID;
    var search = {
      mailmessage_ID: mailmessageID
    }
    this.loginusermailmessagerecipientservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagerecipients(this.loginusermailmessagerecipientservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagerecipientAdvancedSearchAll(mailmessageID) {
    this.mailmessageID = mailmessageID;
    var search = {
      mailmessage_ID: mailmessageID
    }
    this.loginusermailmessagerecipientservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagerecipients(this.loginusermailmessagerecipientservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}