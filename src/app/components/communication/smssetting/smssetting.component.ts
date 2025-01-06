import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ApplicationComponent } from '../../userlogin/application/application.component';
import { SmssettingService } from './smssetting.service';

@Component({
  selector: 'app-smssetting',
  templateUrl: './smssetting.component.html',
  styleUrls: ['./smssetting.component.css']
})
export class SmssettingComponent implements OnInit {
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
  smssettingID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  smssettings = [];
  smssettingsAll = [];
  smssetting = {
    smssetting_ID: 0,
    application_ID: 0,
    sms_NAME: "",
    sms_NUMBER: "",
    isactive:true,
  }
 
  constructor(
    private smssettingservice: SmssettingService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.smssettings = JSON.parse(window.sessionStorage.getItem('smssettings'));
    this.smssettingsAll = JSON.parse(window.sessionStorage.getItem('smssettingsAll'));
    if (this.view == 1 && this.disabled == false && this.smssettings == null) {
      this.smssettingGet();
    } else if (this.view == 1 && this.disabled == true && this.smssettingsAll == null) {
      this.smssettingGetAll();
    } else if (this. view == 2 && this.smssettingsAll == null) {
      this.smssettingGetAll();
    }

    if (this.smssettingID != 0 && !this.smssettingID && Number(window.sessionStorage.getItem('smssetting'))>0) {
      this.smssettingID = Number(window.sessionStorage.getItem('smssetting'));
    }  else if (this. view == 22 && (this.applicationID != null )) {
      this.smssettingAdvancedSearchAll(this.applicationID);
    }
    
    if (this.view == 5 && this.smssettingID) {
      window.sessionStorage.setItem("smssetting", this.smssettingID);
      this.smssettingGetOne(this.smssettingID);
    }
    
    if (this.view == 11 && this.applicationID && this.disabled == false) {
      this.smssettingAdvancedSearch(this.applicationID);
    } else if (this.view == 11 && this.applicationID && this.disabled == true) {
      this.smssettingAdvancedSearchAll(this.applicationID);
      
    } else if (this.view == 11) {
      this.smssettingID = null;
      this.smssettingsAll = null;
      this.smssettings = null;
    }

    // if (this.smssettingID == 0) {
    //   this.applicationDisabled = false;
    //   this.smssettingID = null;
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
          onClick: this.smssettingGetAll.bind(this),
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
          onClick: this.smssettingAdvancedSearchAll.bind(this, this.applicationID),
        },
      }
    );
  }

  add() {
    this.smssetting = {
      smssetting_ID: 0,
      application_ID: 0,
      sms_NAME: "",
      sms_NUMBER: "",
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

  smssettingEdit(){
    this.disabled = false;
  }

  smssettingCancel() {
    this.disabled = true;
    if (this.smssetting.smssetting_ID==0) {
      this.router.navigate(["/home/smssettings"], {});
    }
  }

  setSmssetting(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.smssetting = response;
  }

  setSmssettings(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.smssettings = response;
      window.sessionStorage.setItem("smssettings", JSON.stringify(this.smssettings));
    } else {
      this.smssettingsAll = response;
      window.sessionStorage.setItem("smssettingsAll", JSON.stringify(this.smssettingsAll));
    }
    this.cancel.next();
  }

  smssettingGet() {
    this.smssettingservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSmssettings(this.smssettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  smssettingGetAll() {
    this.smssettingservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSmssettings(this.smssettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  smssettingGetOne(id) {
    this.disabled = true;
    this.smssettingservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSmssetting(this.smssettingservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  smssettingAdd(smssetting) {
    smssetting.isactive="Y";

    if(this.view == 5){
      smssetting.application_ID = this.application.applicationID;
    }else{ 
      smssetting.application_ID = this.addapplication.applicationID;
    }

    this.smssettingservice.add(smssetting).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.smssetting_ID) {
          this.toastrservice.success("Success", "New smssetting Added");
          this.smssettingGetAll();
          this.setSmssetting(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  smssettingUpdate(smssetting) {
     if(this.view == 5){
      smssetting.application_ID = this.application.applicationID;
    }else{ 
      smssetting.application_ID = this.editapplication.applicationID;
    }
    if (smssetting.isactive == true) {
      smssetting.isactive = "Y";
    } else {
      smssetting.isactive = "N";
    }
    this.smssettingservice.update(smssetting, smssetting.smssetting_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.smssetting_ID) {
          this.toastrservice.success("Success", " smssetting Updated");
          if (this.disabled==true) {
            this.setSmssetting(response);
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

  smssettingSearch(str) {
    var search = {
      search: str
    }
    this.smssettingservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSmssettings(this.smssettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  smssettingSearchAll(str) {
    var search = {
      search: str
    }
    this.smssettingservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSmssettings(this.smssettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  smssettingAdvancedSearch(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.smssettingservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSmssettings(this.smssettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  smssettingAdvancedSearchAll(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.smssettingservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setSmssettings(this.smssettingservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}