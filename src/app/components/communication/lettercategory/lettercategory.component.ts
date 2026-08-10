import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { ApplicationComponent } from '../../userlogin/application/application.component';
import { LettercategoryService } from './lettercategory.service';

@Component({
  selector: 'app-lettercategory',
  templateUrl: './lettercategory.component.html',
  styleUrls: ['./lettercategory.component.css']
})
export class LettercategoryComponent implements OnInit {
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
  lettercategoryID = null;
  
  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  lettercategories = [];
  lettercategoriesAll = [];
  lettercategory = {
    lettercategory_ID: 0,
    application_ID:0,
    lettercategory_CODE: "",
    lettercategory_DESC: "",
    isactive:true,
  }
 
  constructor(
    private lettercategoryservice: LettercategoryService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.lettercategories = JSON.parse(window.sessionStorage.getItem('lettercategories'));
    this.lettercategoriesAll = JSON.parse(window.sessionStorage.getItem('lettercategoriesAll'));
    if (this.view == 1 && this.disabled == false && this.lettercategories == null) {
      this.lettercategoryGet();
    } else if (this.view == 1 && this.disabled == true && this.lettercategoriesAll == null) {
      this.lettercategoryGetAll();
    } else if (this. view == 2 && this.lettercategoriesAll == null) {
      this.lettercategoryGetAll();
    }

    if (this.lettercategoryID != 0 && !this.lettercategoryID && Number(window.sessionStorage.getItem('lettercategory'))>0) {
      this.lettercategoryID = Number(window.sessionStorage.getItem('lettercategory'));
    }  else if (this. view == 22 && (this.applicationID != null )) {
      this.lettercategoryAdvancedSearchAll(this.applicationID);
    }
    
    if (this.view == 5 && this.lettercategoryID) {
      window.sessionStorage.setItem("lettercategory", this.lettercategoryID);
      this.lettercategoryGetOne(this.lettercategoryID);
    }
    
    if (this.view == 11 && this.applicationID && this.disabled == false) {
      this.lettercategoryAdvancedSearch(this.applicationID);
    } else if (this.view == 11 && this.applicationID && this.disabled == true) {
      this.lettercategoryAdvancedSearchAll(this.applicationID);
      
    } else if (this.view == 11) {
      this.lettercategoryID = null;
      this.lettercategoriesAll = null;
      this.lettercategories = null;
    }

    // if (this.lettercategoryID == 0) {
    //   this.loginuserDisabled = false;
    //   this.lettercategoryID = null;
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
          onClick: this.lettercategoryGetAll.bind(this),
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
          onClick: this.lettercategoryAdvancedSearchAll.bind(this, this.applicationID),
        },
      }
    );
  }

  add() {
    this.lettercategory = {
      lettercategory_ID: 0,
      application_ID:0,
      lettercategory_CODE: "",
      lettercategory_DESC: "",
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

  lettercategoryEdit(){
    this.disabled = false;
  }

  lettercategoryCancel() {
    this.disabled = true;
    if (this.lettercategory.lettercategory_ID==0) {
      this.router.navigate(["/home/lettercategories"], {});
    }
  }

  setLettercategory(response) {
 
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.lettercategory = response;
  }

  setLettercategories(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.lettercategories = response;
      window.sessionStorage.setItem("lettercategories", JSON.stringify(this.lettercategories));
    } else {
      this.lettercategoriesAll = response;
      window.sessionStorage.setItem("lettercategoriesAll", JSON.stringify(this.lettercategoriesAll));
    }
    this.cancel.next();
  }

  lettercategoryGet() {
    this.lettercategoryservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettercategories(this.lettercategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettercategoryGetAll() {
    this.lettercategoryservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettercategories(this.lettercategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettercategoryGetOne(id) {
    this.disabled = true;
    this.lettercategoryservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettercategory(this.lettercategoryservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettercategoryAdd(lettercategory) {
    lettercategory.isactive="Y";

    if(this.view == 5){
      lettercategory.application_ID = this.application.applicationID;
    }else{ 
      lettercategory.application_ID = this.addapplication.applicationID;
    }

    this.lettercategoryservice.add(lettercategory).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.lettercategory_ID) {
          this.toastrservice.success("Success", "New lettercategory Added");
          this.lettercategoryGetAll();
          this.setLettercategory(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettercategoryUpdate(lettercategory) {
     if(this.view == 5){
      lettercategory.application_ID = this.application.applicationID;
    }else{ 
      lettercategory.application_ID = this.editapplication.applicationID;
    }
    
    if (lettercategory.isactive == true) {
      lettercategory.isactive = "Y";
    } else {
      lettercategory.isactive = "N";
    }
    this.lettercategoryservice.update(lettercategory, lettercategory.lettercategory_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.lettercategory_ID) {
          this.toastrservice.success("Success", " lettercategory Updated");
            this.setLettercategory(response);
            this.lettercategoryGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettercategorySearch(str) {
    var search = {
      search: str
    }
    this.lettercategoryservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettercategories(this.lettercategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettercategorySearchAll(str) {
    var search = {
      search: str
    }
    this.lettercategoryservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettercategories(this.lettercategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettercategoryAdvancedSearch(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.lettercategoryservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettercategories(this.lettercategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  lettercategoryAdvancedSearchAll(applicationID) {
    this.applicationID = applicationID;
    var search = {
      application_ID: applicationID
    }
    this.lettercategoryservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setLettercategories(this.lettercategoryservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}