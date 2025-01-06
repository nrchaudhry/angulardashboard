import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LoginuserComponent } from '../../userlogin/loginuser/loginuser.component';
import { LoginusermaillabelService } from './loginusermaillabel.service';

@Component({
  selector: 'app-loginusermaillabel',
  templateUrl: './loginusermaillabel.component.html',
  styleUrls: ['./loginusermaillabel.component.css']
})
export class LoginusermaillabelComponent implements OnInit {
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
  maillabelID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginusermaillabels = [];
  loginusermaillabelsAll = [];
  loginusermaillabel = {
      maillabel_ID: 0,
      user_ID: 0,
      maillabel_ORDERNO: null,
      maillabel_COLOR: "",
      maillabel_DESC: "",
      isactive:true,
  }
 
  constructor(
    private loginusermaillabelservice: LoginusermaillabelService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginusermaillabels = JSON.parse(window.sessionStorage.getItem('loginusermaillabels'));
    this.loginusermaillabelsAll = JSON.parse(window.sessionStorage.getItem('loginusermaillabelsAll'));
    if (this.view == 1 && this.disabled == false && this.loginusermaillabels == null) {
      this.loginusermaillabelGet();
    } else if (this.view == 1 && this.disabled == true && this.loginusermaillabelsAll == null) {
      this.loginusermaillabelGetAll();
    } else if (this. view == 2 && this.loginusermaillabelsAll == null) {
      this.loginusermaillabelGetAll();
    }

    if (this.maillabelID != 0 && !this.maillabelID && Number(window.sessionStorage.getItem('loginusermaillabel'))>0) {
      this.maillabelID = Number(window.sessionStorage.getItem('loginusermaillabel'));
    }  else if (this. view == 22 && (this.userID != null )) {
      this.loginusermaillabelAdvancedSearchAll(this.userID);
    }
    
    if (this.view == 5 && this.maillabelID) {
      window.sessionStorage.setItem("loginusermaillabel", this.maillabelID);
      this.loginusermaillabelGetOne(this.maillabelID);
    }
    
    if (this.view == 11 && this.userID && this.disabled == false) {
      this.loginusermaillabelAdvancedSearch(this.userID);
    } else if (this.view == 11 && this.userID && this.disabled == true) {
      this.loginusermaillabelAdvancedSearchAll(this.userID);
      
    } else if (this.view == 11) {
      this.maillabelID = null;
      this.loginusermaillabelsAll = null;
      this.loginusermaillabels = null;
    }

    // if (this.maillabelID == 0) {
    //   this.loginuserDisabled = false;
    //   this.maillabelID = null;
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
          onClick: this.loginusermaillabelGetAll.bind(this),
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
          onClick: this.loginusermaillabelAdvancedSearchAll.bind(this, this.userID),
        },
      }
    );
  }

  add() {
    this.loginusermaillabel = {
      maillabel_ID: 0,
      user_ID: 0,
      maillabel_ORDERNO: null,
      maillabel_COLOR: "",
      maillabel_DESC: "",
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

  loginusermaillabelEdit(){
    this.disabled = false;
  }

  loginusermaillabelCancel() {
    this.disabled = true;
    if (this.loginusermaillabel.maillabel_ID==0) {
      this.router.navigate(["/home/loginusermaillabels"], {});
    }
  }

  setLoginusermaillabel(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.loginusermaillabel = response;
  }

  setLoginusermaillabels(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginusermaillabels = response;
      window.sessionStorage.setItem("loginusermaillabels", JSON.stringify(this.loginusermaillabels));
    } else {
      this.loginusermaillabelsAll = response;
      window.sessionStorage.setItem("loginusermaillabelsAll", JSON.stringify(this.loginusermaillabelsAll));
    }
    this.cancel.next();
  }

  loginusermaillabelGet() {
    this.loginusermaillabelservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermaillabels(this.loginusermaillabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermaillabelGetAll() {
    this.loginusermaillabelservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermaillabels(this.loginusermaillabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermaillabelGetOne(id) {
    this.disabled = true;
    this.loginusermaillabelservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermaillabel(this.loginusermaillabelservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermaillabelAdd(loginusermaillabel) {
    loginusermaillabel.isactive="Y";

    if(this.view == 5){
      loginusermaillabel.user_ID = this.loginuser.userID;
    }else{ 
      loginusermaillabel.user_ID = this.addloginuser.userID;
    }

    this.loginusermaillabelservice.add(loginusermaillabel).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.maillabel_ID) {
          this.toastrservice.success("Success", "New Loginusermaillabel Added");
          this.loginusermaillabelGetAll();
          this.setLoginusermaillabel(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermaillabelUpdate(loginusermaillabel) {
     if(this.view == 5){
      loginusermaillabel.user_ID = this.loginuser.userID;
    }else{ 
      loginusermaillabel.user_ID = this.editloginuser.userID;
    }
    if (loginusermaillabel.isactive == true) {
      loginusermaillabel.isactive = "Y";
    } else {
      loginusermaillabel.isactive = "N";
    }
    this.loginusermaillabelservice.update(loginusermaillabel, loginusermaillabel.maillabel_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.maillabel_ID) {
          this.toastrservice.success("Success", " Login User Mail label Updated");
          this.setLoginusermaillabel(response);
         this.loginusermaillabelGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermaillabelSearch(str) {
    var search = {
      search: str
    }
    this.loginusermaillabelservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermaillabels(this.loginusermaillabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermaillabelSearchAll(str) {
    var search = {
      search: str
    }
    this.loginusermaillabelservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermaillabels(this.loginusermaillabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermaillabelAdvancedSearch(userID) {
    this.userID = userID;
    var search = {
      user_ID: userID
    }
    this.loginusermaillabelservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermaillabels(this.loginusermaillabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermaillabelAdvancedSearchAll(userID) {
    this.userID = userID;
    var search = {
      user_ID: userID
    }
    this.loginusermaillabelservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermaillabels(this.loginusermaillabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}