import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LoginusermailmessagerecipientComponent } from '../loginusermailmessagerecipient/loginusermailmessagerecipient.component';
import { LoginusermaillabelComponent } from '../loginusermaillabel/loginusermaillabel.component';
import { LoginusermailmessagelabelService } from './loginusermailmessagelabel.service';

@Component({
  selector: 'app-loginusermailmessagelabel',
  templateUrl: './loginusermailmessagelabel.component.html',
  styleUrls: ['./loginusermailmessagelabel.component.css']
})
export class LoginusermailmessagelabelComponent implements OnInit {
  @ViewChild("loginusermaillabel") loginusermaillabel: LoginusermaillabelComponent;
  @ViewChild("addloginusermaillabel") addloginusermaillabel: LoginusermaillabelComponent;
  @ViewChild("editloginusermaillabel") editloginusermaillabel: LoginusermaillabelComponent;

  @ViewChild("loginusermailmessagerecipient") loginusermailmessagerecipient: LoginusermailmessagerecipientComponent;
  @ViewChild("addloginusermailmessagerecipient") addloginusermailmessagerecipient: LoginusermailmessagerecipientComponent;
  @ViewChild("editloginusermailmessagerecipient") editloginusermailmessagerecipient: LoginusermailmessagerecipientComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  maillabelID = null;
  @Input()
  mailmessagelabelID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginusermailmessagelabels = [];
  loginusermailmessagelabelsAll = [];
  loginusermailmessagelabel = {
      mailmessagelabel_ID: 0,
      maillabel_ID: 0,
      mailmessagerecipient_ID: 0,
      isactive:true,
  }
 
  constructor(
    private loginusermailmessagelabelservice: LoginusermailmessagelabelService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginusermailmessagelabels = JSON.parse(window.sessionStorage.getItem('loginusermailmessagelabels'));
    this.loginusermailmessagelabelsAll = JSON.parse(window.sessionStorage.getItem('loginusermailmessagelabelsAll'));
    if (this.view == 1 && this.disabled == false && this.loginusermailmessagelabels == null) {
      this.loginusermailmessagelabelGet();
    } else if (this.view == 1 && this.disabled == true && this.loginusermailmessagelabelsAll == null) {
      this.loginusermailmessagelabelGetAll();
    } else if (this. view == 2 && this.loginusermailmessagelabelsAll == null) {
      this.loginusermailmessagelabelGetAll();
    }

    if (this.mailmessagelabelID != 0 && !this.mailmessagelabelID && Number(window.sessionStorage.getItem('loginusermailmessagelabel'))>0) {
      this.mailmessagelabelID = Number(window.sessionStorage.getItem('loginusermailmessagelabel'));
    }  else if (this. view == 22 && (this.maillabelID != null )) {
      this.loginusermailmessagelabelAdvancedSearchAll(this.maillabelID);
    }
    
    if (this.view == 5 && this.mailmessagelabelID) {
      window.sessionStorage.setItem("loginusermailmessagelabel", this.mailmessagelabelID);
      this.loginusermailmessagelabelGetOne(this.mailmessagelabelID);
    }
    
    if (this.view == 11 && this.maillabelID && this.disabled == false) {
      this.loginusermailmessagelabelAdvancedSearch(this.maillabelID);
    } else if (this.view == 11 && this.maillabelID && this.disabled == true) {
      this.loginusermailmessagelabelAdvancedSearchAll(this.maillabelID);
      
    } else if (this.view == 11) {
      this.mailmessagelabelID = null;
      this.loginusermailmessagelabelsAll = null;
      this.loginusermailmessagelabels = null;
    }

    // if (this.mailmessagelabelID == 0) {
    //   this.loginusermaillabelDisabled = false;
    //   this.mailmessagelabelID = null;
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
          onClick: this.loginusermailmessagelabelGetAll.bind(this),
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
          onClick: this.loginusermailmessagelabelAdvancedSearchAll.bind(this, this.maillabelID),
        },
      }
    );
  }

  add() {
    this.loginusermailmessagelabel = {
      mailmessagelabel_ID: 0,
      maillabel_ID: 0,
      mailmessagerecipient_ID: 0,
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

  loginusermailmessagelabelEdit(){
    this.disabled = false;
  }

  loginusermailmessagelabelCancel() {
    this.disabled = true;
    if (this.loginusermailmessagelabel.mailmessagelabel_ID==0) {
      this.router.navigate(["/home/loginusemailmessagelabels"], {});
    }
  }

  setLoginusermailmessagelabel(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.loginusermailmessagelabel = response;
  }

  setLoginusermailmessagelabels(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginusermailmessagelabels = response;
      window.sessionStorage.setItem("loginusermailmessagelabels", JSON.stringify(this.loginusermailmessagelabels));
    } else {
      this.loginusermailmessagelabelsAll = response;
      window.sessionStorage.setItem("loginusermailmessagelabelsAll", JSON.stringify(this.loginusermailmessagelabelsAll));
    }
    this.cancel.next();
  }

  loginusermailmessagelabelGet() {
    this.loginusermailmessagelabelservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagelabels(this.loginusermailmessagelabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagelabelGetAll() {
    this.loginusermailmessagelabelservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagelabels(this.loginusermailmessagelabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagelabelGetOne(id) {
    this.disabled = true;
    this.loginusermailmessagelabelservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagelabel(this.loginusermailmessagelabelservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagelabelAdd(loginusermailmessagelabel) {
    loginusermailmessagelabel.isactive="Y";

    if(this.view == 5){
      loginusermailmessagelabel.mailmessagerecipient_ID = this.loginusermailmessagerecipient.mailmessagerecipientID;
      loginusermailmessagelabel.maillabel_ID = this.loginusermaillabel.maillabelID;
    }else{ 
      loginusermailmessagelabel.mailmessagerecipient_ID = this.addloginusermailmessagerecipient.mailmessagerecipientID;
      loginusermailmessagelabel.maillabel_ID = this.addloginusermaillabel.maillabelID;
    }

    this.loginusermailmessagelabelservice.add(loginusermailmessagelabel).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.mailmessagelabel_ID) {
          this.toastrservice.success("Success", "New Loginusermailmessagelabel Added");
          this.loginusermailmessagelabelGetAll();
          this.setLoginusermailmessagelabel(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagelabelUpdate(loginusermailmessagelabel) {
     if(this.view == 5){
      loginusermailmessagelabel.mailmessagerecipient_ID = this.loginusermailmessagerecipient.mailmessagerecipientID;
      loginusermailmessagelabel.maillabel_ID = this.loginusermaillabel.maillabelID;
    }else{ 
      loginusermailmessagelabel.mailmessagerecipient_ID = this.editloginusermailmessagerecipient.mailmessagerecipientID;
      loginusermailmessagelabel.maillabel_ID = this.editloginusermaillabel.maillabelID;
    }
    if (loginusermailmessagelabel.isactive == true) {
      loginusermailmessagelabel.isactive = "Y";
    } else {
      loginusermailmessagelabel.isactive = "N";
    }
    this.loginusermailmessagelabelservice.update(loginusermailmessagelabel, loginusermailmessagelabel.mailmessagelabel_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.mailmessagelabel_ID) {
          this.toastrservice.success("Success", " Loginusermailmessagelabel Updated");
          this.setLoginusermailmessagelabel(response);
          this.loginusermailmessagelabelGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagelabelSearch(str) {
    var search = {
      search: str
    }
    this.loginusermailmessagelabelservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagelabels(this.loginusermailmessagelabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagelabelSearchAll(str) {
    var search = {
      search: str
    }
    this.loginusermailmessagelabelservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagelabels(this.loginusermailmessagelabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagelabelAdvancedSearch(maillabelID) {
    this.maillabelID = maillabelID;
    var search = {
      maillabel_ID: maillabelID
    }
    this.loginusermailmessagelabelservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagelabels(this.loginusermailmessagelabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginusermailmessagelabelAdvancedSearchAll(maillabelID) {
    this.maillabelID = maillabelID;
    var search = {
      maillabel_ID: maillabelID
    }
    this.loginusermailmessagelabelservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginusermailmessagelabels(this.loginusermailmessagelabelservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}