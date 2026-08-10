import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

import { ApplicationComponent } from '../application/application.component';
import { LoginroleService } from './loginrole.service';

@Component({
  selector: 'app-loginrole',
  templateUrl: './loginrole.component.html',
  styleUrls: ['./loginrole.component.css']
})
export class LoginroleComponent implements OnInit {
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
  roleID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginroles = [];
  loginrolesAll = [];
  loginrole = {
      role_ID: 0,
      application_ID: 0,
      role_NAME: "",
      role_DESCRIPTION: "",
      isactive:true,
  }
 
  constructor(
    private loginroleservice: LoginroleService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginroles = JSON.parse(window.sessionStorage.getItem('loginroles'));
    this.loginrolesAll = JSON.parse(window.sessionStorage.getItem('loginrolesAll'));
    if (this.view == 1 && this.disabled == false && this.loginroles == null) {
      this.loginroleGet();
    } else if (this.view == 1 && this.disabled == true && this.loginrolesAll == null) {
      this.loginroleGetAll();
    } else if (this. view == 2 && this.loginrolesAll == null) {
      this.loginroleGetAll();
    }

    if (this.roleID != 0 && !this.roleID && Number(window.sessionStorage.getItem('loginrole'))>0) {
      this.roleID = Number(window.sessionStorage.getItem('loginrole'));
    }  else if (this. view == 22 && (this.applicationID != null )) {
      this.loginroleAdvancedSearchAll(this.applicationID);
    }
    
    if (this.view == 5 && this.roleID) {
      window.sessionStorage.setItem("loginrole", this.roleID);
      this.loginroleGetOne(this.roleID);
    }
    
    if (this.view == 11 && this.applicationID && this.disabled == false) {
      this.loginroleAdvancedSearch(this.applicationID);
    } else if (this.view == 11 && this.applicationID && this.disabled == true) {
      this.loginroleAdvancedSearchAll(this.applicationID);
      
    } else if (this.view == 11) {
      this.roleID = null;
      this.loginrolesAll = null;
      this.loginroles = null;
    }

    // if (this.roleID == 0) {
    //   this.applicationDisabled = false;
    //   this.roleID = null;
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
          onClick: this.loginroleGetAll.bind(this),
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
          onClick: this.loginroleAdvancedSearchAll.bind(this, this.applicationID),
        },
      }
    );
  }

  add() {
    this.loginrole = {
      role_ID: 0,
      application_ID: 0,
      role_NAME: "",
      role_DESCRIPTION: "",
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

  loginroleEdit(){
    this.disabled = false;
  }

  loginroleCancel() {
    this.disabled = true;
    if (this.loginrole.role_ID==0) {
      this.router.navigate(["/home/loginroles"], {});
    }
  }

  setLoginrole(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.loginrole = response;
  }

  setLoginroles(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginroles = response;
      window.sessionStorage.setItem("loginroles", JSON.stringify(this.loginroles));
    } else {
      this.loginrolesAll = response;
      window.sessionStorage.setItem("loginrolesAll", JSON.stringify(this.loginrolesAll));
    }
    this.cancel.next();
  }

  loginroleGet() {
    this.loginroleservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroles(this.loginroleservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleGetAll() {
    this.loginroleservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroles(this.loginroleservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleGetOne(id) {
    this.disabled = true;
    this.loginroleservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginrole(this.loginroleservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleAdd(loginrole) {
    loginrole.isactive="Y";

    if(this.view == 5){
      loginrole.application_ID = this.application.applicationID;
    }else{ 
      loginrole.application_ID = this.addapplication.applicationID;
    }

    this.loginroleservice.add(loginrole).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.role_ID) {
          this.toastrservice.success("Success", "New Loginrole Added");
          this.loginroleGetAll();
          this.setLoginrole(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleUpdate(loginrole) {
     if(this.view == 5){
      loginrole.application_ID = this.application.applicationID;
    }else{ 
      loginrole.application_ID = this.editapplication.applicationID;
    }
    if (loginrole.isactive == true) {
      loginrole.isactive = "Y";
    } else {
      loginrole.isactive = "N";
    }
    this.loginroleservice.update(loginrole, loginrole.role_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.role_ID) {
          this.toastrservice.success("Success", " Loginrole Updated");
          if (this.disabled==true) {
            this.setLoginrole(response);
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

  loginroleSearch(str) {
    var search = {
      search: str
    }
    this.loginroleservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroles(this.loginroleservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleSearchAll(str) {
    var search = {
      search: str
    }
    this.loginroleservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroles(this.loginroleservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleAdvancedSearch(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.loginroleservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroles(this.loginroleservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleAdvancedSearchAll(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.loginroleservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroles(this.loginroleservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}