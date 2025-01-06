import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

import { LoginuserComponent } from '../loginuser/loginuser.component';
import { LoginroleComponent } from '../loginrole/loginrole.component';
import { LoginroleuserService } from './loginroleuser.service';

@Component({
  selector: 'app-loginroleuser',
  templateUrl: './loginroleuser.component.html',
  styleUrls: ['./loginroleuser.component.css']
})
export class LoginroleuserComponent implements OnInit {
  @ViewChild("loginuser") loginuser: LoginuserComponent;
  @ViewChild("addloginuser") addloginuser: LoginuserComponent;
  @ViewChild("editloginuser") editloginuser: LoginuserComponent;

  @ViewChild("loginrole") loginrole: LoginroleComponent;
  @ViewChild("addloginrole") addloginrole: LoginroleComponent;
  @ViewChild("editloginrole") editloginrole: LoginroleComponent;

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
  roleuserID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginroleusers = [];
  loginroleusersAll = [];
  loginroleuser = {
      roleuser_ID: 0,
      user_ID: 0,
      role_ID: 0,
      isactive:true,
  }
 
  constructor(
    private loginroleuserservice: LoginroleuserService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginroleusers = JSON.parse(window.sessionStorage.getItem('loginroleusers'));
    this.loginroleusersAll = JSON.parse(window.sessionStorage.getItem('loginroleusersAll'));
    if (this.view == 1 && this.disabled == false && this.loginroleusers == null) {
      this.loginroleuserGet();
    } else if (this.view == 1 && this.disabled == true && this.loginroleusersAll == null) {
      this.loginroleuserGetAll();
    } else if (this. view == 2 && this.loginroleusersAll == null) {
      this.loginroleuserGetAll();
    }

    if (this.roleuserID != 0 && !this.roleuserID && Number(window.sessionStorage.getItem('loginroleuser'))>0) {
      this.roleuserID = Number(window.sessionStorage.getItem('loginroleuser'));
    }  else if (this. view == 22 && (this.userID != null )) {
      this.loginroleuserAdvancedSearchAll(this.userID);
    }
    
    if (this.view == 5 && this.roleuserID) {
      window.sessionStorage.setItem("loginroleuser", this.roleuserID);
      this.loginroleuserGetOne(this.roleuserID);
    }
    
    if (this.view == 11 && this.userID && this.disabled == false) {
      this.loginroleuserAdvancedSearch(this.userID);
    } else if (this.view == 11 && this.userID && this.disabled == true) {
      this.loginroleuserAdvancedSearchAll(this.userID);
      
    } else if (this.view == 11) {
      this.roleuserID = null;
      this.loginroleusersAll = null;
      this.loginroleusers = null;
    }

    // if (this.roleuserID == 0) {
    //   this.loginuserDisabled = false;
    //   this.roleuserID = null;
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
          onClick: this.loginroleuserGetAll.bind(this),
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
          onClick: this.loginroleuserAdvancedSearchAll.bind(this, this.userID),
        },
      }
    );
  }

  add() {
    this.loginroleuser = {
      roleuser_ID: 0,
      user_ID: 0,
      role_ID: 0,
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

  loginroleuserEdit(){
    this.disabled = false;
  }

  loginroleuserCancel() {
    this.disabled = true;
    if (this.loginroleuser.roleuser_ID==0) {
      this.router.navigate(["/home/loginroleusers"], {});
    }
  }

  setLoginroleuser(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.loginroleuser = response;
  }

  setLoginroleusers(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginroleusers = response;
      window.sessionStorage.setItem("loginroleusers", JSON.stringify(this.loginroleusers));
    } else {
      this.loginroleusersAll = response;
      window.sessionStorage.setItem("loginroleusersAll", JSON.stringify(this.loginroleusersAll));
    }
    this.cancel.next();
  }

  loginroleuserGet() {
    this.loginroleuserservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleusers(this.loginroleuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleuserGetAll() {
    this.loginroleuserservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleusers(this.loginroleuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleuserGetOne(id) {
    this.disabled = true;
    this.loginroleuserservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleuser(this.loginroleuserservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleuserAdd(loginroleuser) {
    loginroleuser.isactive="Y";

    if(this.view == 5){
      loginroleuser.user_ID = this.loginuser.userID;
      loginroleuser.role_ID = this.loginrole.roleID;
    }else{ 
      loginroleuser.user_ID = this.addloginuser.userID;
      loginroleuser.role_ID = this.addloginrole.roleID;
    }

    this.loginroleuserservice.add(loginroleuser).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.roleuser_ID) {
          this.toastrservice.success("Success", "New Loginroleuser Added");
          this.loginroleuserGetAll();
          this.setLoginroleuser(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleuserUpdate(loginroleuser) {
     if(this.view == 5){
      loginroleuser.user_ID = this.loginuser.userID;
      loginroleuser.role_ID = this.loginrole.roleID;
    }else{ 
      loginroleuser.user_ID = this.editloginuser.userID;
      loginroleuser.role_ID = this.editloginrole.roleID;
    }
    if (loginroleuser.isactive == true) {
      loginroleuser.isactive = "Y";
    } else {
      loginroleuser.isactive = "N";
    }
    this.loginroleuserservice.update(loginroleuser, loginroleuser.roleuser_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.roleuser_ID) {
          this.toastrservice.success("Success", " Loginroleuser Updated");
          if (this.disabled==true) {
            this.setLoginroleuser(response);
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

  loginroleuserSearch(str) {
    var search = {
      search: str
    }
    this.loginroleuserservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleusers(this.loginroleuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleuserSearchAll(str) {
    var search = {
      search: str
    }
    this.loginroleuserservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleusers(this.loginroleuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleuserAdvancedSearch(userID) {
    this.userID = userID;
    var search = {
      user_ID: userID
    }
    this.loginroleuserservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleusers(this.loginroleuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleuserAdvancedSearchAll(userID) {
    this.userID = userID;
    var search = {
      user_ID: userID
    }
    this.loginroleuserservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleusers(this.loginroleuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}