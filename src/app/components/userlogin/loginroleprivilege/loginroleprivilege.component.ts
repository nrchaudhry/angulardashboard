import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

import { LoginroleComponent } from '../loginrole/loginrole.component';
import { LoginprivilegeComponent } from '../loginprivilege/loginprivilege.component';
import { LoginroleprivilegeService } from './loginroleprivilege.service';

@Component({
  selector: 'app-loginroleprivilege',
  templateUrl: './loginroleprivilege.component.html',
  styleUrls: ['./loginroleprivilege.component.css']
})
export class LoginroleprivilegeComponent implements OnInit {
  @ViewChild("loginrole") loginrole: LoginroleComponent;
  @ViewChild("addloginrole") addloginrole: LoginroleComponent;
  @ViewChild("editloginrole") editloginrole: LoginroleComponent;

  @ViewChild("loginprivilege") loginprivilege: LoginprivilegeComponent;
  @ViewChild("addloginprivilege") addloginprivilege: LoginprivilegeComponent;
  @ViewChild("editloginprivilege") editloginprivilege: LoginprivilegeComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  loginroleDisabled: boolean = true;
  @Input()
  all: boolean = false;
  @Input()
  roleID = null;
  @Input()
  roleprivilegeID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginroleprivileges = [];
  loginroleprivilegesAll = [];
  loginroleprivilege = {
      roleprivilege_ID: 0,
      privilege_ADD: "",
      privilege_EDIT: "",
      privilege_DELETE:"",
      role_ID: 0,
      privilege_ID: 0,
      isactive:true,
  }
 
  constructor(
    private loginroleprivilegeservice: LoginroleprivilegeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginroleprivileges = JSON.parse(window.sessionStorage.getItem('loginroleprivileges'));
    this.loginroleprivilegesAll = JSON.parse(window.sessionStorage.getItem('loginroleprivilegesAll'));
    if (this.view == 1 && this.disabled == false && this.loginroleprivileges == null) {
      this.loginroleprivilegeGet();
    } else if (this.view == 1 && this.disabled == true && this.loginroleprivilegesAll == null) {
      this.loginroleprivilegeGetAll();
    } else if (this. view == 2 && this.loginroleprivilegesAll == null) {
      this.loginroleprivilegeGetAll();
    }

    if (this.roleprivilegeID != 0 && !this.roleprivilegeID && Number(window.sessionStorage.getItem('loginroleprivilege'))>0) {
      this.roleprivilegeID = Number(window.sessionStorage.getItem('loginroleprivilege'));
    }  else if (this. view == 22 && (this.roleID != null )) {
      this.loginroleprivilegeAdvancedSearchAll(this.roleID);
    }
    
    if (this.view == 5 && this.roleprivilegeID) {
      window.sessionStorage.setItem("loginroleprivilege", this.roleprivilegeID);
      this.loginroleprivilegeGetOne(this.roleprivilegeID);
    }
    
    if (this.view == 11 && this.roleID && this.disabled == false) {
      this.loginroleprivilegeAdvancedSearch(this.roleID);
    } else if (this.view == 11 && this.roleID && this.disabled == true) {
      this.loginroleprivilegeAdvancedSearchAll(this.roleID);
      
    } else if (this.view == 11) {
      this.roleprivilegeID = null;
      this.loginroleprivilegesAll = null;
      this.loginroleprivileges = null;
    }

    // if (this.roleprivilegeID == 0) {
    //   this.loginroleDisabled = false;
    //   this.roleprivilegeID = null;
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
          onClick: this.loginroleprivilegeGetAll.bind(this),
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
          onClick: this.loginroleprivilegeAdvancedSearchAll.bind(this, this.roleID),
        },
      }
    );
  }

  add() {
    this.loginroleprivilege = {
      roleprivilege_ID: 0,
      privilege_ADD: "",
      privilege_EDIT: "",
      privilege_DELETE:"",
      role_ID: 0,
      privilege_ID: 0,
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

  loginroleprivilegeEdit(){
    this.disabled = false;
  }

  loginroleprivilegeCancel() {
    this.disabled = true;
    if (this.loginroleprivilege.roleprivilege_ID==0) {
      this.router.navigate(["/home/loginroleprivileges"], {});
    }
  }

  setLoginroleprivilege(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.loginroleprivilege = response;
  }

  setLoginroleprivileges(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginroleprivileges = response;
      window.sessionStorage.setItem("loginroleprivileges", JSON.stringify(this.loginroleprivileges));
    } else {
      this.loginroleprivilegesAll = response;
      window.sessionStorage.setItem("loginroleprivilegesAll", JSON.stringify(this.loginroleprivilegesAll));
    }
    this.cancel.next();
  }

  loginroleprivilegeGet() {
    this.loginroleprivilegeservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleprivileges(this.loginroleprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleprivilegeGetAll() {
    this.loginroleprivilegeservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleprivileges(this.loginroleprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleprivilegeGetOne(id) {
    this.disabled = true;
    this.loginroleprivilegeservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleprivilege(this.loginroleprivilegeservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleprivilegeAdd(loginroleprivilege) {
    loginroleprivilege.isactive="Y";

    if(this.view == 5){
      loginroleprivilege.role_ID = this.loginrole.roleID;
      loginroleprivilege.privilege_ID = this.loginprivilege.privilegeID;
    }else{ 
      loginroleprivilege.role_ID = this.addloginrole.roleID;
      loginroleprivilege.privilege_ID = this.addloginprivilege.privilegeID;
    }

    this.loginroleprivilegeservice.add(loginroleprivilege).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.roleprivilege_ID) {
          this.toastrservice.success("Success", "New Loginroleprivilege Added");
          this.loginroleprivilegeGetAll();
          this.setLoginroleprivilege(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleprivilegeUpdate(loginroleprivilege) {
     if(this.view == 5){
      loginroleprivilege.role_ID = this.loginrole.roleID;
      loginroleprivilege.privilege_ID = this.loginprivilege.privilegeID;
    }else{ 
      loginroleprivilege.role_ID = this.editloginrole.roleID;
      loginroleprivilege.privilege_ID = this.editloginprivilege.privilegeID;
    }
    if (loginroleprivilege.isactive == true) {
      loginroleprivilege.isactive = "Y";
    } else {
      loginroleprivilege.isactive = "N";
    }
    this.loginroleprivilegeservice.update(loginroleprivilege, loginroleprivilege.roleprivilege_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.roleprivilege_ID) {
          this.toastrservice.success("Success", " Loginroleprivilege Updated");
          if (this.disabled==true) {
            this.setLoginroleprivilege(response);
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

  loginroleprivilegeSearch(str) {
    var search = {
      search: str
    }
    this.loginroleprivilegeservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleprivileges(this.loginroleprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleprivilegeSearchAll(str) {
    var search = {
      search: str
    }
    this.loginroleprivilegeservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleprivileges(this.loginroleprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleprivilegeAdvancedSearch(roleID) {
    this.roleID = roleID;
    var search = {
      role_ID: roleID
    }
    this.loginroleprivilegeservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleprivileges(this.loginroleprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginroleprivilegeAdvancedSearchAll(roleID) {
    this.roleID = roleID;
    var search = {
      role_ID: roleID
    }
    this.loginroleprivilegeservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginroleprivileges(this.loginroleprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}