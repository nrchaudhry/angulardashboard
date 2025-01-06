import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

import { ApplicationComponent } from '../application/application.component';
import { LoginprivilegecategoryService } from './loginprivilegecategory.service';

@Component({
  selector: 'app-loginprivilegecategory',
  templateUrl: './loginprivilegecategory.component.html',
  styleUrls: ['./loginprivilegecategory.component.css']
})
export class LoginprivilegecategoryComponent implements OnInit {
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
  pcategoryID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  loginprivilegecategories = [];
  loginprivilegecategoriesAll = [];
  loginprivilegecategory = {
      pcategory_ID: 0,
      pcategoryorder_NO: null,
      pcategory_NAME: "",
      pcategory_ICON:"",
      pcategory_DESCRIPTION:"",
      application_ID: 0,
      isactive:true,
  }
 
  constructor(
    private loginprivilegecategoryservice: LoginprivilegecategoryService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loginprivilegecategories = JSON.parse(window.sessionStorage.getItem('loginprivilegecategories'));
    this.loginprivilegecategoriesAll = JSON.parse(window.sessionStorage.getItem('loginprivilegecategoriesAll'));
    if (this.view == 1 && this.disabled == false && this.loginprivilegecategories == null) {
      this.loginprivilegecategoryGet();
    } else if (this.view == 1 && this.disabled == true && this.loginprivilegecategoriesAll == null) {
      this.loginprivilegecategoryGetAll();
    } else if (this. view == 2 && this.loginprivilegecategoriesAll == null) {
      this.loginprivilegecategoryGetAll();
    }

    if (this.pcategoryID != 0 && !this.pcategoryID && Number(window.sessionStorage.getItem('loginprivilegecategory'))>0) {
      this.pcategoryID = Number(window.sessionStorage.getItem('loginprivilegecategory'));
    }  else if (this. view == 22 && (this.applicationID != null )) {
      this.loginprivilegecategoryAdvancedSearchAll(this.applicationID);
    }
    
    if (this.view == 5 && this.pcategoryID) {
      window.sessionStorage.setItem("loginprivilegecategory", this.pcategoryID);
      this.loginprivilegecategoryGetOne(this.pcategoryID);
    }
    
    if (this.view == 11 && this.applicationID && this.disabled == false) {
      this.loginprivilegecategoryAdvancedSearch(this.applicationID);
    } else if (this.view == 11 && this.applicationID && this.disabled == true) {
      this.loginprivilegecategoryAdvancedSearchAll(this.applicationID);
      
    } else if (this.view == 11) {
      this.pcategoryID = null;
      this.loginprivilegecategoriesAll = null;
      this.loginprivilegecategories = null;
    }

    // if (this.pcategoryID == 0) {
    //   this.applicationDisabled = false;
    //   this.pcategoryID = null;
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
          onClick: this.loginprivilegecategoryGetAll.bind(this),
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
          onClick: this.loginprivilegecategoryAdvancedSearchAll.bind(this, this.applicationID),
        },
      }
    );
  }

  add() {
    this.loginprivilegecategory = {
      pcategory_ID: 0,
      pcategoryorder_NO: null,
      pcategory_NAME: "",
      pcategory_ICON:"",
      pcategory_DESCRIPTION:"",
      application_ID: 0,
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

  loginprivilegecategoryEdit(){
    this.disabled = false;
  }

  loginprivilegecategoryCancel() {
    this.disabled = true;
    if (this.loginprivilegecategory.pcategory_ID==0) {
      this.router.navigate(["/home/loginprivilegecategories"], {});
    }
  }

  setLoginprivilegecategory(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.loginprivilegecategory = response;
  }

  setLoginprivilegecategorys(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.loginprivilegecategories = response;
      window.sessionStorage.setItem("loginprivilegecategories", JSON.stringify(this.loginprivilegecategories));
    } else {
      this.loginprivilegecategoriesAll = response;
      window.sessionStorage.setItem("loginprivilegecategoriesAll", JSON.stringify(this.loginprivilegecategoriesAll));
    }
    this.cancel.next();
  }

  loginprivilegecategoryGet() {
    this.loginprivilegecategoryservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivilegecategorys(this.loginprivilegecategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegecategoryGetAll() {
    this.loginprivilegecategoryservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivilegecategorys(this.loginprivilegecategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegecategoryGetOne(id) {
    this.disabled = true;
    this.loginprivilegecategoryservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivilegecategory(this.loginprivilegecategoryservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegecategoryAdd(loginprivilegecategory) {
    loginprivilegecategory.isactive="Y";

    if(this.view == 5){
      loginprivilegecategory.application_ID = this.application.applicationID;
    }else{ 
      loginprivilegecategory.application_ID = this.addapplication.applicationID;
    }

    this.loginprivilegecategoryservice.add(loginprivilegecategory).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.pcategory_ID) {
          this.toastrservice.success("Success", "New Loginprivilegecategory Added");
          this.loginprivilegecategoryGetAll();
          this.setLoginprivilegecategory(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegecategoryUpdate(loginprivilegecategory) {
     if(this.view == 5){
      loginprivilegecategory.application_ID = this.application.applicationID;
    }else{ 
      loginprivilegecategory.application_ID = this.editapplication.applicationID;
    }
    if (loginprivilegecategory.isactive == true) {
      loginprivilegecategory.isactive = "Y";
    } else {
      loginprivilegecategory.isactive = "N";
    }
    this.loginprivilegecategoryservice.update(loginprivilegecategory, loginprivilegecategory.pcategory_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.pcategory_ID) {
          this.toastrservice.success("Success", " Loginprivilegecategory Updated");
          if (this.disabled==true) {
            this.setLoginprivilegecategory(response);
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

  loginprivilegecategorySearch(str) {
    var search = {
      search: str
    }
    this.loginprivilegecategoryservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivilegecategorys(this.loginprivilegecategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegecategorySearchAll(str) {
    var search = {
      search: str
    }
    this.loginprivilegecategoryservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivilegecategorys(this.loginprivilegecategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegecategoryAdvancedSearch(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.loginprivilegecategoryservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivilegecategorys(this.loginprivilegecategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  loginprivilegecategoryAdvancedSearchAll(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.loginprivilegecategoryservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLoginprivilegecategorys(this.loginprivilegecategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}