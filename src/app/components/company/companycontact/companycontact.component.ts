import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { CompanycontactService } from './companycontact.service';
import { CompanyComponent } from '../company/company.component';
import { ContacttypeComponent } from '../../lookup/common/contacttype/contacttype.component';


@Component({
  selector: 'app-companycontact',
  templateUrl: './companycontact.component.html',
  styleUrls: ['./companycontact.component.css']
})
export class CompanycontactComponent implements OnInit {
  @ViewChild("contacttype") contacttype: ContacttypeComponent;
  @ViewChild("company") company: CompanyComponent;

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
  contacttypeID = null;
  @Input()
  contacttypeCode = null;
  @Input()
  companyID = null;
  @Input()
  companycontactID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCompanyContactChange = new EventEmitter();

  companycontacts = [];
  companycontactsAll = [];
  companycontact = {
    companycontact_ID: 0,
    contacttype_ID: null,
    company_ID: null,
    contact_VALUE: null,
    ispreaferd: false,
    isverified: false,
    isactive: true,
  }

  constructor(
    private companycontactservice: CompanycontactService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('companycontacts') != null) {
      this.companycontacts = JSON.parse(window.sessionStorage.getItem('companycontacts'));
    }
    if (window.sessionStorage.getItem('companycontactsAll') != null) {
      this.companycontactsAll = JSON.parse(window.sessionStorage.getItem('companycontactsAll'));
    }
    if (this.companycontactID != 0 && !this.companycontactID && Number(window.sessionStorage.getItem('companycontact')) > 0) {
      this.companycontactID = Number(window.sessionStorage.getItem('companycontact'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.companycontacts == null || this.companycontacts.length == 0 || reload == true)) {
      this.companycontacts == null;
      this.companycontactGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.companycontactsAll == null || this.companycontactsAll.length == 0 || reload == true)) {
      this.companycontactsAll == null;
      this.companycontactGetAll();
    }

    var search = {
      contacttype_ID: this.contacttypeID,
      contacttype_CODE: this.contacttypeCode,

      company_ID: this.companyID,
    }
    if (this.view >= 5 && this.view <= 6 && this.companycontactID) {
      window.sessionStorage.setItem("companycontact", this.companycontactID);
      this.companycontactGetOne(this.companycontactID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.companycontacts == null || this.companycontacts.length == 0 || reload == true)) {
      this.companycontacts == null;
      this.companycontactAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.companycontactsAll == null || this.companycontactsAll.length == 0 || reload == true)) {
      this.companycontactsAll == null;
      this.companycontactAdvancedSearchAll(search);
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

  onChange(companycontactID) {
    for (var i = 0; i < this.companycontactsAll.length; i++) {
      if (this.companycontactsAll[i].companycontact_ID == companycontactID) {
        this.onCompanyContactChange.next(this.companycontactsAll[i]);
        break;
      }
    }
  }

  add() {
    this.companycontact = {
      companycontact_ID: 0,
      contacttype_ID: null,
      company_ID: null,
      contact_VALUE: null,
      ispreaferd: false,
      isverified: false,
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

  companycontactEdit() {
    this.disabled = false;
  }

  companycontactCancel() {
    this.disabled = true;
    console.log(this.companycontact);
    if (this.companycontact.companycontact_ID == 0) {
      this.router.navigate(["/home/companycontacts"], {});
    }
  }

  setCompanycontact(response) {
    this.companyID = response.company_ID;
    this.companycontactID = response.companycontact_ID;
    if (response.ispreaferd == "Y") {
      response.ispreaferd = true;
    } else {
      response.ispreaferd = false;
    }
    if (response.isverified == "Y") {
      response.isverified = true;
    } else {
      response.isverified = false;
    }
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.companycontact = response;
  }

  setCompanycontacts(response) {
    this.cancel.next();
    return response;
  }

  companycontactGet() {
    this.companycontactservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontacts = this.setCompanycontacts(this.companycontactservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontacts", JSON.stringify(this.companycontacts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactGetAll() {
    this.companycontactservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontactsAll = this.setCompanycontacts(this.companycontactservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontactsAll", JSON.stringify(this.companycontactsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactGetOne(id) {
    this.disabled = true;
    this.companycontactservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCompanycontact(this.companycontactservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactAdd(companycontact) {
    // companycontact.contacttype_ID = this.contacttype.contacttypeID;
    companycontact.company_ID = this.company.companyID;
    if (companycontact.ispreaferd == true) {
      companycontact.ispreaferd = "Y";
    } else {
      companycontact.ispreaferd = "N";
    }
    if (companycontact.isverified == true) {
      companycontact.isverified = "Y";
    } else {
      companycontact.isverified = "N";
    }
    companycontact.isactive = "Y";

    this.companycontactservice.add(companycontact).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.companycontact_ID) {
          this.toastrservice.success("Success", "New Companycontact Added");
          this.setCompanycontact(this.companycontactservice.getDetail(response));
          this.refresh.next();
          this.companycontactGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactUpdate(companycontact) {
    // companycontact.contacttype_ID = this.contacttype.contacttypeID;
    companycontact.company_ID = this.company.companyID;

    if (companycontact.ispreaferd == true) {
      companycontact.ispreaferd = "Y";
    } else {
      companycontact.ispreaferd = "N";
    }
    if (companycontact.isverified == true) {
      companycontact.isverified = "Y";
    } else {
      companycontact.isverified = "N";
    }
    if (companycontact.isactive == true) {
      companycontact.isactive = "Y";
    } else {
      companycontact.isactive = "N";
    }
    this.companycontactservice.update(companycontact, companycontact.companycontact_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.companycontact_ID) {
          this.toastrservice.success("Success", "Companycontact Updated");
          this.setCompanycontact(this.companycontactservice.getDetail(response));
          this.refresh.next();
          this.companycontactGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactUpdateAll(companycontacts) {
    this.companycontactservice.updateAll(companycontacts).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Companycontacts Updated");
          this.setCompanycontact(this.companycontactservice.getDetail(response));
          this.refresh.next();
        } else {

          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactSearch(str) {
    var search = {
      search: str
    }
    this.companycontactservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontacts = this.setCompanycontacts(this.companycontactservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontacts", JSON.stringify(this.companycontacts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactSearchAll(str) {
    var search = {
      search: str
    }
    this.companycontactservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontactsAll = this.setCompanycontacts(this.companycontactservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontactsAll", JSON.stringify(this.companycontactsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactAdvancedSearch(search) {
    this.contacttypeID = search.contacttype_ID;
    this.contacttypeCode = search.contacttype_CODE;
    this.companyID = search.company_ID;
    this.companycontactservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontacts = this.setCompanycontacts(this.companycontactservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontacts", JSON.stringify(this.companycontacts));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactAdvancedSearchAll(search) {
    this.contacttypeID = search.contacttype_ID;
    this.contacttypeCode = search.contacttype_CODE;
    this.companyID = search.company_ID;
    this.companycontactservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontactsAll = this.setCompanycontacts(this.companycontactservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontactsAll", JSON.stringify(this.companycontactsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
