import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CompanyService } from './company.service';
import { BusinessnatureComponent } from '../../lookup/company/businessnature/businessnature.component';
import { CompanystatusComponent } from '../../lookup/company/companystatus/companystatus.component';
import { CompanysubtypeComponent } from '../companysubtype/companysubtype.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  @ViewChild("companysubtype") companysubtype: CompanysubtypeComponent;
  @ViewChild("businessnature") businessnature: BusinessnatureComponent;
  @ViewChild("companystatus") companystatus: CompanystatusComponent;

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
  companysubtypeID = null;
  @Input()
  companyID = null;
  @Input()
  businessnatureID = null;
  @Input()
  businessnatureCode = null;
  @Input()
  companystatusID = null;
  @Input()
  companystatusCode = null;
  @Input()
  companyparentID = null;
  @Input()
  companyparentCode = null;
  @Input()
  netsuiteID = null;
  @Input()
  netsuiteCode = null;
  @Input()
  intakeDisabled: boolean = true;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCompanyChange = new EventEmitter();

  companies = [];
  companiesAll = [];
  company = {
    company_ID: 0,
    netsuite_ID: null,
    company_CODE: null,
    company_NAME: null,
    company_DESC: null,
    registered_NUMBER: null,
    tax_NUMBER: null,
    companysubtype_ID: null,
    companyparent_ID: null,
    companystatus_ID: null,
    businessnature_ID: null,
    start_DATE: null,
    end_DATE: null,
    companylogo_PATH: null,
    isactive: true,
  }

  constructor(
    private companieservice: CompanyService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('companies') != null) {
      this.companies = JSON.parse(window.sessionStorage.getItem('companies'));
    }
    if (window.sessionStorage.getItem('companiesAll') != null) {
      this.companiesAll = JSON.parse(window.sessionStorage.getItem('companiesAll'));
    }
    if (this.companyID != 0 && !this.companyID && Number(window.sessionStorage.getItem('company')) > 0) {
      this.companyID = Number(window.sessionStorage.getItem('company'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.companies == null || this.companies.length == 0 || reload == true)) {
      this.companies == null;
      this.companyGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.companiesAll == null || this.companiesAll.length == 0 || reload == true)) {
      this.companiesAll == null;
      this.companyGetAll();
    }

    var search = {
      companysubtype_ID: this.companysubtypeID,
      netsuite_ID: this.netsuiteID,
      netsuite_CODE: this.netsuiteCode,
      businessnature_ID: this.businessnatureID,
      businessnature_CODE: this.businessnatureCode,
      companystatus_ID: this.companystatusID,
      companystatus_CODE: this.companystatusCode,
      companyparent_ID: this.companyparentID,
      companyparent_CODE: this.companyparentCode,
    }
    if (this.view >= 5 && this.view <= 6 && this.companyID) {
      window.sessionStorage.setItem("company", this.companyID);
      this.companyGetOne(this.companyID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.companies == null || this.companies.length == 0 || reload == true)) {
      this.companies == null;
      this.companyAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.companiesAll == null || this.companiesAll.length == 0 || reload == true)) {
      this.companiesAll == null;
      this.companyAdvancedSearchAll(search);
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

  onChange(companyID) {
    for (var i = 0; i < this.companiesAll.length; i++) {
      if (this.companiesAll[i].company_ID == companyID) {
        this.onCompanyChange.next(this.companiesAll[i]);
        break;
      }
    }
  }

  add() {
    this.company = {
      company_ID: 0,
      netsuite_ID: null,
      company_CODE: null,
      company_NAME: null,
      company_DESC: null,
      registered_NUMBER: null,
      tax_NUMBER: null,
      companysubtype_ID: null,
      companyparent_ID: null,
      companystatus_ID: null,
      businessnature_ID: null,
      start_DATE: null,
      end_DATE: null,
      companylogo_PATH: null,
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

  companyEdit() {
    this.disabled = false;
  }

  companyCancel() {
    this.disabled = true;
    if (this.company.company_ID == 0) {
      this.router.navigate(["/home/companies"], {});
    }
  }

  setCompany(response) {
    this.companyID = response.company_ID;
    this.netsuiteID = response.netsuite_ID;
    this.businessnatureID = response.businessnature_ID;
    this.companyparentID = response.companyparent_ID;
    this.companystatusID = response.companystatus_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.company = response;
  }

  setCompanies(response) {
    this.cancel.next();
    return response;
  }

  companyGet() {
    this.companieservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companies = this.setCompanies(this.companieservice.getAllDetail(response));
          window.sessionStorage.setItem("companies", JSON.stringify(this.companies));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyGetAll() {
    this.companieservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companiesAll = this.setCompanies(this.companieservice.getAllDetail(response));
          window.sessionStorage.setItem("companiesAll", JSON.stringify(this.companiesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyGetOne(id) {
    this.disabled = true;
    this.companieservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCompany(this.companieservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyAdd(company) {
    company.companysubtype_ID = this.companysubtypeID;
    company.businessnature_ID = this.businessnature.businessnatureID;
    company.companystatus_ID = this.companystatus.companystatusID;
    company.isactive = "Y";

    this.companieservice.add(company).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.company_ID) {
          this.toastrservice.success("Success", "New Intake Course Added");
          this.setCompany(this.companieservice.getDetail(response));
          this.refresh.next();
          this.companyGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyUpdate(company) {
    company.companysubtype_ID = this.companysubtypeID;
    company.businessnature_ID = this.businessnature.businessnatureID;
    company.companystatus_ID = this.companystatus.companystatusID;

    if (company.isactive == true) {
      company.isactive = "Y";
    } else {
      company.isactive = "N";
    }
    this.companieservice.update(company, company.company_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.company_ID) {
          this.toastrservice.success("Success", "Intake Course Updated");
          this.setCompany(this.companieservice.getDetail(response));
          this.refresh.next();
          this.companyGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyUpdateAll(companies) {
    this.companieservice.updateAll(companies).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Intake Courses Updated");
          this.setCompany(this.companieservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companySearch(str) {
    var search = {
      search: str
    }
    this.companieservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companies = this.setCompanies(this.companieservice.getAllDetail(response));
          window.sessionStorage.setItem("companies", JSON.stringify(this.companies));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companySearchAll(str) {
    var search = {
      search: str
    }
    this.companieservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companiesAll = this.setCompanies(this.companieservice.getAllDetail(response));
          window.sessionStorage.setItem("companiesAll", JSON.stringify(this.companiesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyAdvancedSearch(search) {
    this.companysubtypeID = search.companysubtype_ID;
    this.netsuiteID = search.netsuite_ID;
    this.netsuiteCode = search.netsuite_CODE;
    this.businessnatureID = search.businessnature_ID;
    this.businessnatureCode = search.businessnature_CODE;
    this.companyparentID = search.companyparent_ID;
    this.companyparentCode = search.companyparent_CODE;
    this.companystatusID = search.companystatus_ID;
    this.companystatusCode = search.companystatus_CODE;
    this.companieservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companies = this.setCompanies(this.companieservice.getAllDetail(response));
          window.sessionStorage.setItem("companies", JSON.stringify(this.companies));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companyAdvancedSearchAll(search) {
    this.companysubtypeID = search.companysubtype_ID;
    this.netsuiteID = search.netsuite_ID;
    this.netsuiteCode = search.netsuite_CODE;
    this.businessnatureID = search.businessnature_ID;
    this.businessnatureCode = search.businessnature_CODE;
    this.companyparentID = search.companyparent_ID;
    this.companyparentCode = search.companyparent_CODE;
    this.companystatusID = search.companystatus_ID;
    this.companystatusCode = search.companystatus_CODE;
    this.companieservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companiesAll = this.setCompanies(this.companieservice.getAllDetail(response));
          window.sessionStorage.setItem("companiesAll", JSON.stringify(this.companiesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
