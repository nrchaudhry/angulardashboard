import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LoginuserComponent } from '../../userlogin/loginuser/loginuser.component';
import { LoginusermailmessageService } from './loginusermailmessage.service';

@Component({
  selector: 'app-loginusermailmessage',
  templateUrl: './loginusermailmessage.component.html',
  styleUrls: ['./loginusermailmessage.component.css']
})
export class LoginusermailmessageComponent implements OnInit {
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
  loginuserDisabled: boolean = true;
  @Input()
  all: boolean = false;
  @Input()
  userID = null;
  @Input()
  mailmessageID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginusermailmessages = [];
  loginusermailmessagesAll = [];
  loginusermailmessage = {
      mailmessage_ID: 0,
      user_ID: 0,
      mailmessage_DATE: "",
      mailmessage_SUBJECT: "",
      mailmessage_BODY: "",
      issent: true,
      isactive:true,
  }
 
  constructor(
    private loginusermailmessageservice: LoginusermailmessageService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginusermailmessages = JSON.parse(window.sessionStorage.getItem('loginusermailmessages'));
    this.loginusermailmessagesAll = JSON.parse(window.sessionStorage.getItem('loginusermailmessagesAll'));
    if (this.view == 1 && this.disabled == false && this.loginusermailmessages == null) {
      this.loginusermailmessageGet();
    } else if (this.view == 1 && this.disabled == true && this.loginusermailmessagesAll == null) {
      this.loginusermailmessageGetAll();
    } else if (this. view == 2 && this.loginusermailmessagesAll == null) {
      this.loginusermailmessageGetAll();
    }

    if (this.mailmessageID != 0 && !this.mailmessageID && Number(window.sessionStorage.getItem('loginusermailmessage'))>0) {
      this.mailmessageID = Number(window.sessionStorage.getItem('loginusermailmessage'));
    }  else if (this. view == 22 && (this.userID != null )) {
      this.loginusermailmessageAdvancedSearchAll(this.userID);
    }
    
    if (this.view == 5 && this.mailmessageID) {
      window.sessionStorage.setItem("loginusermailmessage", this.mailmessageID);
      this.loginusermailmessageGetOne(this.mailmessageID);
    }
    
    if (this.view == 11 && this.userID && this.disabled == false) {
      this.loginusermailmessageAdvancedSearch(this.userID);
    } else if (this.view == 11 && this.userID && this.disabled == true) {
      this.loginusermailmessageAdvancedSearchAll(this.userID);
      
    } else if (this.view == 11) {
      this.mailmessageID = null;
      this.loginusermailmessagesAll = null;
      this.loginusermailmessages = null;
    }

    // if (this.mailmessageID == 0) {
    //   this.loginuserDisabled = false;
    //   this.mailmessageID = null;
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
          onClick: this.loginusermailmessageGetAll.bind(this),
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
          onClick: this.loginusermailmessageAdvancedSearchAll.bind(this, this.userID),
        },
      }
    );
  }

  add() {
    this.loginusermailmessage = {
      mailmessage_ID: 0,
      user_ID: 0,
      mailmessage_DATE: "",
      mailmessage_SUBJECT: "",
      mailmessage_BODY: "",
      issent: true,
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

  loginusermailmessageEdit(){
    this.disabled = false;
  }

  loginusermailmessageCancel() {
    this.disabled = true;
    if (this.loginusermailmessage.mailmessage_ID==0) {
      this.router.navigate(["/home/loginusemailmessages"], {});
    }
  }

  setLoginusermailmessage(response) {
    if (response.issent == "Y") {
      response.issent = true;
    } else {
      response.issent = false;
    }
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.loginusermailmessage = response;
  }

  setLoginusermailmessages(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginusermailmessages = response;
      window.sessionStorage.setItem("loginusermailmessages", JSON.stringify(this.loginusermailmessages));
    } else {
      this.loginusermailmessagesAll = response;
      window.sessionStorage.setItem("loginusermailmessagesAll", JSON.stringify(this.loginusermailmessagesAll));
    }
    this.cancel.next();
  }

  loginusermailmessageGet() {
    this.loginusermailmessageservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessages(this.loginusermailmessageservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageGetAll() {
    this.loginusermailmessageservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessages(this.loginusermailmessageservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageGetOne(id) {
    this.disabled = true;
    this.loginusermailmessageservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessage(this.loginusermailmessageservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageAdd(loginusermailmessage) {
    loginusermailmessage.issent="Y";
    loginusermailmessage.isactive="Y";

    if(this.view == 5){
      loginusermailmessage.user_ID = this.loginuser.userID;
    }else{ 
      loginusermailmessage.user_ID = this.addloginuser.userID;
    }

    this.loginusermailmessageservice.add(loginusermailmessage).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.mailmessage_ID) {
          this.toastrservice.success("Success", "New Loginusermailmessage Added");
          this.loginusermailmessageGetAll();
          this.setLoginusermailmessage(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageUpdate(loginusermailmessage) {
     if(this.view == 5){
      loginusermailmessage.user_ID = this.loginuser.userID;
    }else{ 
      loginusermailmessage.user_ID = this.editloginuser.userID;
    }
    if (loginusermailmessage.issent == true) {
      loginusermailmessage.issent = "Y";
    } else {
      loginusermailmessage.issent = "N";
    }
    if (loginusermailmessage.isactive == true) {
      loginusermailmessage.isactive = "Y";
    } else {
      loginusermailmessage.isactive = "N";
    }
    this.loginusermailmessageservice.update(loginusermailmessage, loginusermailmessage.mailmessage_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.mailmessage_ID) {
          this.toastrservice.success("Success", " Loginusermailmessage Updated");
            this.setLoginusermailmessage(response);
            this.loginusermailmessageGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageSearch(str) {
    var search = {
      search: str
    }
    this.loginusermailmessageservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessages(this.loginusermailmessageservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageSearchAll(str) {
    var search = {
      search: str
    }
    this.loginusermailmessageservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessages(this.loginusermailmessageservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageAdvancedSearch(userID) {
    this.userID = userID;
    var search = {
      user_ID: userID
    }
    this.loginusermailmessageservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessages(this.loginusermailmessageservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessageAdvancedSearchAll(userID) {
    this.userID = userID;
    var search = {
      user_ID: userID
    }
    this.loginusermailmessageservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessages(this.loginusermailmessageservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}