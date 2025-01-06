import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

import { LoginprivilegecategoryComponent } from '../loginprivilegecategory/loginprivilegecategory.component';
import { LoginprivilegeService } from './loginprivilege.service';

@Component({
  selector: 'app-loginprivilege',
  templateUrl: './loginprivilege.component.html',
  styleUrls: ['./loginprivilege.component.css']
})
export class LoginprivilegeComponent implements OnInit {
  @ViewChild("loginprivilegecategory") loginprivilegecategory: LoginprivilegecategoryComponent;
  @ViewChild("addloginprivilegecategory") addloginprivilegecategory: LoginprivilegecategoryComponent;
  @ViewChild("editloginprivilegecategory") editloginprivilegecategory: LoginprivilegecategoryComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  loginprivilegecategoryDisabled: boolean = true;
  @Input()
  all: boolean = false;
  @Input()
  pcategoryID = null;
  @Input()
  privilegeID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginprivileges = [];
  loginprivilegesAll = [];
  loginprivilege = {
      privilege_ID: 0,
      pcategory_ID: 0,
      privilegeorder_NO: null,
      privilege_NAME: "",
      privilege_DESCRIPTION:"",
      privilege_STATE:"",
      privilege_URL:"",
      privilege_TEMPLATEURL: "",
      privilege_CONTROLLER: "",
      privilege_CONTROLLERPATH: "",
      ismenuprivilege:true,
      isactive:true,
  }
 
  constructor(
    private loginprivilegeservice: LoginprivilegeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginprivileges = JSON.parse(window.sessionStorage.getItem('loginprivileges'));
    this.loginprivilegesAll = JSON.parse(window.sessionStorage.getItem('loginprivilegesAll'));
    if (this.view == 1 && this.disabled == false && this.loginprivileges == null) {
      this.loginprivilegeGet();
    } else if (this.view == 1 && this.disabled == true && this.loginprivilegesAll == null) {
      this.loginprivilegeGetAll();
    } else if (this. view == 2 && this.loginprivilegesAll == null) {
      this.loginprivilegeGetAll();
    }

    if (this.privilegeID != 0 && !this.privilegeID && Number(window.sessionStorage.getItem('loginprivilege'))>0) {
      this.privilegeID = Number(window.sessionStorage.getItem('loginprivilege'));
    }  else if (this. view == 22 && (this.pcategoryID != null )) {
      this.loginprivilegeAdvancedSearchAll(this.pcategoryID);
    }
    
    if (this.view == 5 && this.privilegeID) {
      window.sessionStorage.setItem("loginprivilege", this.privilegeID);
      this.loginprivilegeGetOne(this.privilegeID);
    }
    
    if (this.view == 11 && this.pcategoryID && this.disabled == false) {
      this.loginprivilegeAdvancedSearch(this.pcategoryID);
    } else if (this.view == 11 && this.pcategoryID && this.disabled == true) {
      this.loginprivilegeAdvancedSearchAll(this.pcategoryID);
      
    } else if (this.view == 11) {
      this.privilegeID = null;
      this.loginprivilegesAll = null;
      this.loginprivileges = null;
    }

    // if (this.privilegeID == 0) {
    //   this.loginprivilegecategoryDisabled = false;
    //   this.privilegeID = null;
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
          onClick: this.loginprivilegeGetAll.bind(this),
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
          onClick: this.loginprivilegeAdvancedSearchAll.bind(this, this.pcategoryID),
        },
      }
    );
  }

  add() {
    this.loginprivilege = {
      privilege_ID: 0,
      pcategory_ID: 0,
      privilegeorder_NO: null,
      privilege_NAME: "",
      privilege_DESCRIPTION:"",
      privilege_STATE:"",
      privilege_URL:"",
      privilege_TEMPLATEURL: "",
      privilege_CONTROLLER: "",
      privilege_CONTROLLERPATH: "",
      ismenuprivilege:true,
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

  loginprivilegeEdit(){
    this.disabled = false;
  }

  loginprivilegeCancel() {
    this.disabled = true;
    if (this.loginprivilege.privilege_ID==0) {
      this.router.navigate(["/home/loginprivileges"], {});
    }
  }

  setLoginprivilege(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    if (response.ismenuprivilege == "Y") {
      response.ismenuprivilege = true;
    } else {
      response.ismenuprivilege = false;
    }
    this.loginprivilege = response;
  }

  setLoginprivileges(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginprivileges = response;
      window.sessionStorage.setItem("loginprivileges", JSON.stringify(this.loginprivileges));
    } else {
      this.loginprivilegesAll = response;
      window.sessionStorage.setItem("loginprivilegesAll", JSON.stringify(this.loginprivilegesAll));
    }
    this.cancel.next();
  }

  loginprivilegeGet() {
    this.loginprivilegeservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivileges(this.loginprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegeGetAll() {
    this.loginprivilegeservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivileges(this.loginprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegeGetOne(id) {
    this.disabled = true;
    this.loginprivilegeservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivilege(this.loginprivilegeservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegeAdd(loginprivilege) {
    loginprivilege.isactive="Y";
    loginprivilege.ismenuprivilege="Y";

    if(this.view == 5){
      loginprivilege.pcategory_ID = this.loginprivilegecategory.pcategoryID;
    }else{ 
      loginprivilege.pcategory_ID = this.addloginprivilegecategory.pcategoryID;
    }

    this.loginprivilegeservice.add(loginprivilege).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.privilege_ID) {
          this.toastrservice.success("Success", "New Loginprivilege Added");
          this.loginprivilegeGetAll();
          this.setLoginprivilege(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegeUpdate(loginprivilege) {
     if(this.view == 5){
      loginprivilege.pcategory_ID = this.loginprivilegecategory.pcategoryID;
    }else{ 
      loginprivilege.pcategory_ID = this.editloginprivilegecategory.pcategoryID;
    }
    if (loginprivilege.isactive == true) {
      loginprivilege.isactive = "Y";
    } else {
      loginprivilege.isactive = "N";
    }
    if (loginprivilege.ismenuprivilege == true) {
      loginprivilege.ismenuprivilege = "Y";
    } else {
      loginprivilege.ismenuprivilege = "N";
    }
    this.loginprivilegeservice.update(loginprivilege, loginprivilege.privilege_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.privilege_ID) {
          this.toastrservice.success("Success", " Loginprivilege Updated");
          if (this.disabled==true) {
            this.setLoginprivilege(response);
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

  loginprivilegeSearch(str) {
    var search = {
      search: str
    }
    this.loginprivilegeservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivileges(this.loginprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegeSearchAll(str) {
    var search = {
      search: str
    }
    this.loginprivilegeservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivileges(this.loginprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegeAdvancedSearch(pcategoryID) {
    this.pcategoryID = pcategoryID;
    var search = {
      pcategory_ID: pcategoryID
    }
    this.loginprivilegeservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivileges(this.loginprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegeAdvancedSearchAll(pcategoryID) {
    this.pcategoryID = pcategoryID;
    var search = {
      pcategory_ID: pcategoryID
    }
    this.loginprivilegeservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivileges(this.loginprivilegeservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}