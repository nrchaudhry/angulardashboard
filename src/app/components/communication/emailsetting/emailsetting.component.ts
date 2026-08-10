import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ApplicationComponent } from '../../userlogin/application/application.component';
import { EmailsettingService } from './emailsetting.service';

@Component({
  selector: 'app-emailsetting',
  templateUrl: './emailsetting.component.html',
  styleUrls: ['./emailsetting.component.css']
})
export class EmailsettingComponent implements OnInit {
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
  emailsettingID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  emailsettings = [];
  emailsettingsAll = [];
  emailsetting = {
      emailsetting_ID: 0,
      application_ID: 0,
      email_NAME: "",
      email_ADDRESS:"",
      emailsetting_SERVER:"",
      isactive:true,
  }
 
  constructor(
    private emailsettingservice: EmailsettingService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.emailsettings = JSON.parse(window.sessionStorage.getItem('emailsettings'));
    this.emailsettingsAll = JSON.parse(window.sessionStorage.getItem('emailsettingsAll'));
    if (this.view == 1 && this.disabled == false && this.emailsettings == null) {
      this.emailsettingGet();
    } else if (this.view == 1 && this.disabled == true && this.emailsettingsAll == null) {
      this.emailsettingGetAll();
    } else if (this. view == 2 && this.emailsettingsAll == null) {
      this.emailsettingGetAll();
    }

    if (this.emailsettingID != 0 && !this.emailsettingID && Number(window.sessionStorage.getItem('emailsetting'))>0) {
      this.emailsettingID = Number(window.sessionStorage.getItem('emailsetting'));
    }  else if (this. view == 22 && (this.applicationID != null )) {
      this.emailsettingAdvancedSearchAll(this.applicationID);
    }
    
    if (this.view == 5 && this.emailsettingID) {
      window.sessionStorage.setItem("emailsetting", this.emailsettingID);
      this.emailsettingGetOne(this.emailsettingID);
    }
    
    if (this.view == 11 && this.applicationID && this.disabled == false) {
      this.emailsettingAdvancedSearch(this.applicationID);
    } else if (this.view == 11 && this.applicationID && this.disabled == true) {
      this.emailsettingAdvancedSearchAll(this.applicationID);
      
    } else if (this.view == 11) {
      this.emailsettingID = null;
      this.emailsettingsAll = null;
      this.emailsettings = null;
    }

    // if (this.emailsettingID == 0) {
    //   this.emailsettingDisabled = false;
    //   this.emailsettingID = null;
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
          onClick: this.emailsettingGetAll.bind(this),
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
          onClick: this.emailsettingAdvancedSearchAll.bind(this, this.applicationID),
        },
      }
    );
  }

  add() {
    this.emailsetting = {
      emailsetting_ID: 0,
      application_ID: 0,
      email_NAME: "",
      email_ADDRESS:"",
      emailsetting_SERVER:"",
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

  emailsettingEdit(){
    this.disabled = false;
  }

  emailsettingCancel() {
    this.disabled = true;
    if (this.emailsetting.emailsetting_ID==0) {
      this.router.navigate(["/home/emailsettings"], {});
    }
  }

  setEmailsetting(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.emailsetting = response;
  }

  setEmailsettings(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.emailsettings = response;
      window.sessionStorage.setItem("emailsettings", JSON.stringify(this.emailsettings));
    } else {
      this.emailsettingsAll = response;
      window.sessionStorage.setItem("emailsettingsAll", JSON.stringify(this.emailsettingsAll));
    }
    this.cancel.next();
  }

  emailsettingGet() {
    this.emailsettingservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEmailsettings(this.emailsettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  emailsettingGetAll() {
    this.emailsettingservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEmailsettings(this.emailsettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  emailsettingGetOne(id) {
    this.disabled = true;
    this.emailsettingservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEmailsetting(this.emailsettingservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  emailsettingAdd(emailsetting) {
    emailsetting.isactive="Y";

    if(this.view == 5){
      emailsetting.application_ID = this.application.applicationID;
    }else{ 
      emailsetting.application_ID = this.addapplication.applicationID;
    }

    this.emailsettingservice.add(emailsetting).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.emailsetting_ID) {
          this.toastrservice.success("Success", "New emailsetting Added");
          this.emailsettingGetAll();
          this.setEmailsetting(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  emailsettingUpdate(emailsetting) {
    if(this.view == 5){
      emailsetting.application_ID = this.application.applicationID;
    } else{ 
      emailsetting.application_ID = this.editapplication.applicationID;
    }
    if (emailsetting.isactive == true) {
      emailsetting.isactive = "Y";
    } else {
      emailsetting.isactive = "N";
    }
    this.emailsettingservice.update(emailsetting, emailsetting.emailsetting_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.emailsetting_ID) {
          this.toastrservice.success("Success", " Emailsetting Updated");
            this.setEmailsetting(response);
            this.emailsettingGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  emailsettingSearch(str) {
    var search = {
      search: str
    }
    this.emailsettingservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEmailsettings(this.emailsettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  emailsettingSearchAll(str) {
    var search = {
      search: str
    }
    this.emailsettingservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEmailsettings(this.emailsettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  emailsettingAdvancedSearch(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.emailsettingservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEmailsettings(this.emailsettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  emailsettingAdvancedSearchAll(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.emailsettingservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setEmailsettings(this.emailsettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}