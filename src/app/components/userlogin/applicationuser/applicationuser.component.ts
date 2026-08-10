import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

import { LoginuserComponent } from '../loginuser/loginuser.component';
import { ApplicationComponent } from '../application/application.component';
import { ApplicationuserService } from './applicationuser.service';

@Component({
  selector: 'app-applicationuser',
  templateUrl: './applicationuser.component.html',
  styleUrls: ['./applicationuser.component.css']
})
export class ApplicationuserComponent implements OnInit {
  @ViewChild("loginuser") loginuser: LoginuserComponent;
  @ViewChild("addloginuser") addloginuser: LoginuserComponent;
  @ViewChild("editloginuser") editloginuser: LoginuserComponent;

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
  loginuserDisabled: boolean = true;
  @Input()
  applicationDisabled: boolean = true;
  @Input()
  all: boolean = false;
  @Input()
  userID = null;
  @Input()
  applicationID = null;
  @Input()
  applicationuserID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  applicationusers = [];
  applicationusersAll = [];
  applicationuser = {
      applicationuser_ID: 0,
      application_THEME: "",
      user_ID:  0,
      application_ID: 0,
      isadmin:  true,
      isactive:true,
  }
 
  constructor(
    private applicationuserservice: ApplicationuserService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.applicationusers = JSON.parse(window.sessionStorage.getItem('applicationusers'));
    this.applicationusersAll = JSON.parse(window.sessionStorage.getItem('applicationusersAll'));
    if (this.view == 1 && this.disabled == false && this.applicationusers == null) {
      this.applicationuserGet();
    } else if (this.view == 1 && this.disabled == true && this.applicationusersAll == null) {
      this.applicationuserGetAll();
    } else if (this. view == 2 && this.applicationusersAll == null) {
      this.applicationuserGetAll();
    }

    if (this.applicationuserID != 0 && !this.applicationuserID && Number(window.sessionStorage.getItem('applicationuser'))>0) {
      this.applicationuserID = Number(window.sessionStorage.getItem('applicationuser'));
    }  else if (this. view == 22 && (this.userID != null )) {
      this.applicationuserAdvancedSearchAll(this.userID);
    }
    
    if (this.view == 5 && this.applicationuserID) {
      window.sessionStorage.setItem("applicationuser", this.applicationuserID);
      this.applicationuserGetOne(this.applicationuserID);
    }
    
    if (this.view == 11 && this.userID && this.disabled == false) {
      this.applicationuserAdvancedSearch(this.userID);
    } else if (this.view == 11 && this.userID && this.disabled == true) {
      this.applicationuserAdvancedSearchAll(this.userID);
      
    } else if (this.view == 11) {
      this.applicationuserID = null;
      this.applicationusersAll = null;
      this.applicationusers = null;
    }

    // if (this.applicationuserID == 0) {
    //   this.loginuserDisabled = false;
    //   this.applicationuserID = null;
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
          onClick: this.applicationuserGetAll.bind(this),
        },
      }
    );
  }

  onToolbarPreparingAdvanced(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.applicationuserAdvancedSearchAll.bind(this, this.userID),
        },
      }
    );
  }

  add() {
    this.applicationuser = {
      applicationuser_ID: 0,
      application_THEME: "",
      user_ID:  0,
      application_ID: 0,
      isadmin:  true,
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

  applicationuserEdit(){
    this.disabled = false;
  }

  applicationuserCancel() {
    this.disabled = true;
    if (this.applicationuser.applicationuser_ID==0) {
      this.router.navigate(["/home/applicationusers"], {});
    }
  }

  setApplicationuser(response) {
    if (response.isadmin == "Y") {
      response.isadmin = true;
    } else {
      response.isadmin = false;
    }
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.applicationuser = response;
  }

  setApplicationusers(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.applicationusers = response;
      window.sessionStorage.setItem("applicationusers", JSON.stringify(this.applicationusers));
    } else {
      this.applicationusersAll = response;
      window.sessionStorage.setItem("applicationusersAll", JSON.stringify(this.applicationusersAll));
    }
    this.cancel.next();
  }

  applicationuserGet() {
    this.applicationuserservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setApplicationusers(this.applicationuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationuserGetAll() {
    this.applicationuserservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setApplicationusers(this.applicationuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationuserGetOne(id) {
    this.disabled = true;
    this.applicationuserservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setApplicationuser(this.applicationuserservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationuserAdd(applicationuser) {
    applicationuser.isadmin="Y";
    applicationuser.isactive="Y";

    if(this.view == 5){
      applicationuser.user_ID = this.loginuser.userID;
      applicationuser.application_ID = this.application.applicationID;
    }else{ 
      applicationuser.user_ID = this.addloginuser.userID;
      applicationuser.application_ID = this.addapplication.applicationID;
    }

    this.applicationuserservice.add(applicationuser).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.applicationuser_ID) {
          this.toastrservice.success("Success", "New Applicationuser Added");
          this.applicationuserGetAll();
          this.setApplicationuser(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationuserUpdate(applicationuser) {
     if(this.view == 5){
      applicationuser.user_ID = this.loginuser.userID;
      applicationuser.application_ID = this.application.applicationID;
    }else{ 
      applicationuser.user_ID = this.editloginuser.userID;
      applicationuser.application_ID = this.editapplication.applicationID;
    }
    if (applicationuser.isadmin == true) {
      applicationuser.isadmin = "Y";
    } else {
      applicationuser.isadmin = "N";
    }
    if (applicationuser.isactive == true) {
      applicationuser.isactive = "Y";
    } else {
      applicationuser.isactive = "N";
    }
    this.applicationuserservice.update(applicationuser, applicationuser.applicationuser_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.applicationuser_ID) {
          this.toastrservice.success("Success", " Applicationuser Updated");
          if (this.disabled==true) {
            this.setApplicationuser(response);
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

  applicationuserSearch(str) {
    var search = {
      search: str
    }
    this.applicationuserservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setApplicationusers(this.applicationuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationuserSearchAll(str) {
    var search = {
      search: str
    }
    this.applicationuserservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setApplicationusers(this.applicationuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationuserAdvancedSearch(userID) {
    this.userID = userID;
    var search = {
      user_ID: userID
    }
    this.applicationuserservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setApplicationusers(this.applicationuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationuserAdvancedSearchAll(userID) {
    this.userID = userID;
    var search = {
      user_ID: userID
    }
    this.applicationuserservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setApplicationusers(this.applicationuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}