import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from 'src/app/services/on-fail.service';

import { ApplicationtypeComponent } from 'src/app/components/lookup/application/applicationtype/applicationtype.component';
import { ApplicationService } from './application.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  @ViewChild("applicationtype") applicationtype: ApplicationtypeComponent;
  @ViewChild("addapplicationtype") addapplicationtype: ApplicationtypeComponent;
  @ViewChild("editapplicationtype") editapplicationtype: ApplicationtypeComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  applicationID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() onApplicationChange = new EventEmitter();

  applications = [];
  applicationsAll = [];
  application = {
    application_ID: 0,
    applicationtype_ID: null,
    application_GUID: null,
    application_CODE: "",
    application_NAME: "",
    application_SHORTNAME: "",
    application_DESCRIPTION: "",
    applicationservice_PATH: "",
    applicationpath_FRONTEND: "",
    applicationlogo_PATH: "",
    oauthservice_PATH: "",
    headername: "",
    projecttitle: "",
    copyrights_YEAR: "",
    companylink: "",
    companyname: "",
    ispublic: true,
    isactive: true,
  }

  constructor(
    private applicationservice: ApplicationService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.applications = JSON.parse(window.sessionStorage.getItem('applications'));
    this.applicationsAll = JSON.parse(window.sessionStorage.getItem('applicationsAll'));
    if (this.view == 1 && this.disabled == false && this.applications == null) {
      this.applicationGet();
    } else if (this.view == 1 && this.disabled == true && this.applicationsAll == null) {
      this.applicationGetAll();
    } else if (this.view == 2 && this.applicationsAll == null) {
      this.applicationGetAll();
    }

    if (this.applicationID != 0 && !this.applicationID && Number(window.sessionStorage.getItem('application')) > 0) {
      this.applicationID = Number(window.sessionStorage.getItem('application'));
    }
    if (this.view == 5 && this.applicationID) {
      window.sessionStorage.setItem("application", this.applicationID);
      this.applicationGetOne(this.applicationID);
    }

    if (this.applicationID == 0)
      this.applicationID = null;
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.applicationGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.application = {
      application_ID: 0,
      applicationtype_ID: null,
      application_GUID: null,
      application_CODE: "",
      application_NAME: "",
      application_SHORTNAME: "",
      application_DESCRIPTION: "",
      applicationservice_PATH: "",
      applicationpath_FRONTEND: "",
      applicationlogo_PATH: "",
      oauthservice_PATH: "",
      headername: "",
      projecttitle: "",
      copyrights_YEAR: "",
      companylink: "",
      companyname: "",
      ispublic: true,
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

  applicationEdit() {
    this.disabled = false;
  }

  applicationCancel() {
    this.disabled = true;
    if (this.application.application_ID == 0) {
      this.router.navigate(["/home/applications"], {});
    }
  }

  onChange(application) {
    this.onApplicationChange.next(application);
  }

  setApplication(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    if (response.ispublic == "Y") {
      response.ispublic = true;
    } else {
      response.ispublic = false;
    }
    this.application = response;
    this.disabled = true;
  }

  setUniversities(response) {
    if (this.view == 1 && this.disabled == false) {
      this.applications = response;
      window.sessionStorage.setItem("applications", JSON.stringify(this.applications));
    } else {
      this.applicationsAll = response;
      window.sessionStorage.setItem("applicationsAll", JSON.stringify(this.applicationsAll));
    }
    this.cancel.next();
  }

  applicationGet() {
    this.applicationservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setUniversities(this.applicationservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationGetAll() {
    this.applicationservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setUniversities(this.applicationservice.getAllDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationGetOne(id) {
    this.applicationservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setApplication(this.applicationservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
  applicationAdd(application) {
    application.isactive = "Y";
    application.ispublic = "Y";
    if (this.view == 5) {
      application.applicationtype_ID = this.applicationtype.applicationtypeID;
    } else {
      application.applicationtype_ID = this.addapplicationtype.applicationtypeID;
    }

    this.applicationservice.add(application).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.application_ID) {
          this.toastrservice.success("Success", "New Application Added");
          this.applicationGetAll();
          this.setApplication(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  applicationUpdate(application) {
    if (this.view == 5) {
      application.applicationtype_ID = this.applicationtype.applicationtypeID;
    } else {
      application.applicationtype_ID = this.editapplicationtype.applicationtypeID;
    }
    if (application.isactive == true) {
      application.isactive = "Y";
    } else {
      application.isactive = "N";
    }
    if (application.ispublic == true) {
      application.ispublic = "Y";
    } else {
      application.ispublic = "N";
    }

    this.applicationservice.update(application, application.application_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.application_ID) {
          this.toastrservice.success("Success", " Application Updated");
          if (this.disabled == true) {
            this.setApplication(response);
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