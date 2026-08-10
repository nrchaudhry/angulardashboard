import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

import { EmployeeComponent } from 'src/app/components/employee/employee/employee.component';
import { PersonComponent } from 'src/app/components/person/person/person.component';
import { LoginuserService } from './loginuser.service';

@Component({
  selector: 'app-loginuser',
  templateUrl: './loginuser.component.html',
  styleUrls: ['./loginuser.component.css']
})
export class LoginuserComponent implements OnInit {
  @ViewChild("person") person: PersonComponent;
  @ViewChild("addperson") addperson: PersonComponent;
  @ViewChild("editperson") editperson: PersonComponent;

  @ViewChild("employee") employee: EmployeeComponent;
  @ViewChild("addemployee") addemployee: EmployeeComponent;
  @ViewChild("editemployee") editemployee: EmployeeComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  userID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() onLoginuserChange = new EventEmitter();

  loginusers = [];
  loginusersAll = [];
  loginuser = {
    user_ID: 0,
    username: "",
    last_LOGIN: "",
    user_NAME: "",
    email: null,
    employee_ID: 0,
    person_ID: 0,
    ischangepassword_REQUESTED: null,
    ischangepassword_REQUESTEDWHEN: null,
    enabled: true,
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    isactive: true,
  }

  constructor(
    private loginuserservice: LoginuserService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginusers = JSON.parse(window.sessionStorage.getItem('loginusers'));
    this.loginusersAll = JSON.parse(window.sessionStorage.getItem('loginusersAll'));
    if (this.view == 1 && this.disabled == false && this.loginusers == null) {
      this.loginuserGet();
    } else if (this.view == 1 && this.disabled == true && this.loginusersAll == null) {
      this.loginuserGetAll();
    } else if (this.view == 2 && this.loginusersAll == null) {
      this.loginuserGetAll();
    }

    if (this.userID != 0 && !this.userID && Number(window.sessionStorage.getItem('loginuser')) > 0) {
      this.userID = Number(window.sessionStorage.getItem('loginuser'));
    }
    if (this.view == 5 && this.userID) {
      window.sessionStorage.setItem("loginuser", this.userID);
      this.loginuserGetOne(this.userID);
    }

    if (this.userID == 0)
      this.userID = null;
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.loginuserGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.loginuser = {
      user_ID: 0,
      username: "",
      last_LOGIN: "",
      user_NAME: "",
      email: null,
      employee_ID: 0,
      person_ID: 0,
      ischangepassword_REQUESTED: null,
      ischangepassword_REQUESTEDWHEN: null,

      enabled: true,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      isactive: true,
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

  loginuserEdit() {
    this.disabled = false;
  }

  loginuserCancel() {
    this.disabled = true;
    if (this.loginuser.user_ID == 0) {
      this.router.navigate(["/home/loginusers"], {});
    }
  }

  onChange(loginuser) {
    this.onLoginuserChange.next(loginuser);
  }

  setLoginuser(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    if (response.enabled == "Y") {
      response.enabled = true;
    } else {
      response.enabled = false;
    }
    if (response.accountNonExpired == "Y") {
      response.accountNonExpired = true;
    } else {
      response.accountNonExpired = false;
    }
    if (response.accountNonLocked == "Y") {
      response.accountNonLocked = true;
    } else {
      response.accountNonLocked = false;
    }
    if (response.credentialsNonExpired == "Y") {
      response.credentialsNonExpired = true;
    } else {
      response.credentialsNonExpired = false;
    }
    this.loginuser = response;
    this.disabled = true;
  }

  setUniversities(response) {
    if (this.view == 1 && this.disabled == false) {
      this.loginusers = response;
      window.sessionStorage.setItem("loginusers", JSON.stringify(this.loginusers));
    } else {
      this.loginusersAll = response;
      window.sessionStorage.setItem("loginusersAll", JSON.stringify(this.loginusersAll));
    }
    this.cancel.next();
  }

  loginuserGet() {
    this.loginuserservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setUniversities(this.loginuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginuserGetAll() {
    this.loginuserservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setUniversities(this.loginuserservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginuserGetOne(id) {
    this.loginuserservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setLoginuser(this.loginuserservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  loginuserAdd(loginuser) {
    loginuser.isactive = "Y";
    loginuser.enabled = "Y";
    loginuser.accountNonExpired = "Y";
    loginuser.accountNonLocked = "Y";
    loginuser.credentialsNonExpired = "Y";
    if (this.view == 5) {
      loginuser.person_ID = this.person.personID;
      loginuser.employee_ID = this.employee.employeeID;
    } else {
      loginuser.person_ID = this.addperson.personID;
      loginuser.employee_ID = this.addemployee.employeeID;
    }

    this.loginuserservice.add(loginuser).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.user_ID) {
          this.toastrservice.success("Success", "New Loginuser Added");
          this.loginuserGetAll();
          this.setLoginuser(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginuserUpdate(loginuser) {
    if (this.view == 5) {
      loginuser.person_ID = this.person.personID;
      loginuser.employee_ID = this.employee.employeeID;
    } else {
      loginuser.person_ID = this.editperson.personID;
      loginuser.employee_ID = this.editemployee.employeeID;
    }
    if (loginuser.isactive == true) {
      loginuser.isactive = "Y";
    } else {
      loginuser.isactive = "N";
    }
    if (loginuser.enabled == true) {
      loginuser.enabled = "Y";
    } else {
      loginuser.enabled = "N";
    }
    if (loginuser.accountNonExpired == true) {
      loginuser.accountNonExpired = "Y";
    } else {
      loginuser.accountNonExpired = "N";
    }
    if (loginuser.accountNonLocked == true) {
      loginuser.accountNonLocked = "Y";
    } else {
      loginuser.accountNonLocked = "N";
    }
    if (loginuser.credentialsNonExpired == true) {
      loginuser.credentialsNonExpired = "Y";
    } else {
      loginuser.credentialsNonExpired = "N";
    }

    this.loginuserservice.update(loginuser, loginuser.user_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.user_ID) {
          this.toastrservice.success("Success", " Loginuser Updated");
          if (this.disabled == true) {
            this.setLoginuser(response);
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
}
