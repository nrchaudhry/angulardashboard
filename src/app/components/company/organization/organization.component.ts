import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { OrganizationService } from './organization.service';
import { OrganizationtypeComponent } from '../../lookup/company/organizationtype/organizationtype.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  @ViewChild("organizationtype") organizationtype: OrganizationtypeComponent;

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  isreload: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  @Input()
  organizationtypeID = null;
  @Input()
  organizationtypeCode = null;
  @Input()
  organizationID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCompanySubTypeChange = new EventEmitter();

  organizations = [];
  organizationsAll = [];
  organization = {
    organization_ID: 0,
    organizationtype_ID: null,
    organization_NAME: null,
    organization_DESC: null,
    isactive: true,
  }

  constructor(
    private organizationservice: OrganizationService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('organizations') != null) {
      this.organizations = JSON.parse(window.sessionStorage.getItem('organizations'));
    }
    if (window.sessionStorage.getItem('organizationsAll') != null) {
      this.organizationsAll = JSON.parse(window.sessionStorage.getItem('organizationsAll'));
    }
    if (this.organizationID != 0 && !this.organizationID && Number(window.sessionStorage.getItem('organization')) > 0) {
      this.organizationID = Number(window.sessionStorage.getItem('organization'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.organizations == null || this.organizations.length == 0 || reload == true)) {
      this.organizations == null;
      this.organizationGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.organizationsAll == null || this.organizationsAll.length == 0 || reload == true)) {
      this.organizationsAll == null;
      this.organizationGetAll();
    }

    var search = {
      organizationtype_ID: this.organizationtypeID,
      organizationtype_CODE: this.organizationtypeCode,

    }
    if (this.view >= 5 && this.view <= 6 && this.organizationID) {
      window.sessionStorage.setItem("organization", this.organizationID);
      this.organizationGetOne(this.organizationID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.organizations == null || this.organizations.length == 0 || reload == true)) {
      this.organizations == null;
      this.organizationAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.organizationsAll == null || this.organizationsAll.length == 0 || reload == true)) {
      this.organizationsAll == null;
      this.organizationAdvancedSearchAll(search);
    }
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.load.bind(this, true),
        },
      }
    );
  }

  add() {
    this.organization = {
      organization_ID: 0,
      organizationtype_ID: null,
      organization_NAME: null,
      organization_DESC: null,
      isactive: true,
    };
  }

  onClickedRow(row) {

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

  organizationEdit() {
    this.disabled = false;
  }

  organizationCancel() {
    this.disabled = true;
    if (this.organization.organization_ID == 0) {
      this.router.navigate(["/home/organizations"], {});
    }
  }

  onChange(organizationID) {
    for (var i = 0; i < this.organizationsAll.length; i++) {
      if (this.organizationsAll[i].organization_ID == organizationID) {
        this.onCompanySubTypeChange.next(this.organizationsAll[i]);
        break;
      }
    }
  }

  setOrganization(response) {
    this.organizationtypeID = response.organizationtype_ID;
    this.organizationID = response.organization_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.organization = response;
  }

  setOrganizations(response) {
    this.cancel.next();
    return response;
  }

  organizationGet() {
    this.organizationservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.organizations = this.setOrganizations(this.organizationservice.getAllDetail(response));
          window.sessionStorage.setItem("organizations", JSON.stringify(this.organizations));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationGetAll() {
    this.organizationservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.organizationsAll = this.setOrganizations(this.organizationservice.getAllDetail(response));
          window.sessionStorage.setItem("organizationsAll", JSON.stringify(this.organizationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationGetOne(id) {
    this.disabled = true;
    this.organizationservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setOrganization(this.organizationservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationAdd(organization) {
    // organization.organizationtype_ID = this.organizationtype.organizationtypeID;
    organization.isactive = "Y";

    this.organizationservice.add(organization).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.organization_ID) {
          this.toastrservice.success("Success", "New Organization Added");
          this.setOrganization(this.organizationservice.getDetail(response));
          this.refresh.next();
          this.organizationGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationUpdate(organization) {
    // organization.organizationtype_ID = this.organizationtype.organizationtypeID;

    if (organization.isactive == true) {
      organization.isactive = "Y";
    } else {
      organization.isactive = "N";
    }
    this.organizationservice.update(organization, organization.organization_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.organization_ID) {
          this.toastrservice.success("Success", "Organization Updated");
          this.setOrganization(this.organizationservice.getDetail(response));
          this.refresh.next();
          this.organizationGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationUpdateAll(organizations) {
    this.organizationservice.updateAll(organizations).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Organizations Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationSearch(str) {
    var search = {
      search: str
    }
    this.organizationservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.organizations = this.setOrganizations(this.organizationservice.getAllDetail(response));
          window.sessionStorage.setItem("organizations", JSON.stringify(this.organizations));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationSearchAll(str) {
    var search = {
      search: str
    }
    this.organizationservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.organizationsAll = this.setOrganizations(this.organizationservice.getAllDetail(response));
          window.sessionStorage.setItem("organizationsAll", JSON.stringify(this.organizationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationAdvancedSearch(search) {
    this.organizationtypeID = search.organizationtype_ID;
    this.organizationtypeCode = search.organizationtype_CODE;

    this.organizationservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.organizations = this.setOrganizations(this.organizationservice.getAllDetail(response));
          window.sessionStorage.setItem("organizations", JSON.stringify(this.organizations));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  organizationAdvancedSearchAll(search) {
    this.organizationtypeID = search.organizationtype_ID;
    this.organizationtypeCode = search.organizationtype_CODE;

    this.organizationservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.organizationsAll = this.setOrganizations(this.organizationservice.getAllDetail(response));
          window.sessionStorage.setItem("organizationsAll", JSON.stringify(this.organizationsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
