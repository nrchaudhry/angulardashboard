import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CompanysubtypeService } from './companysubtype.service';
import { CompanytypeComponent } from '../../lookup/company/companytype/companytype.component';

@Component({
  selector: 'app-companysubtype',
  templateUrl: './companysubtype.component.html',
  styleUrls: ['./companysubtype.component.css']
})
export class CompanysubtypeComponent implements OnInit {
  @ViewChild("companytype") companytype: CompanytypeComponent;

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
  companytypeID = null;
  @Input()
  companytypeCode = null;
  @Input()
  companysubtypeID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCompanySubTypeChange = new EventEmitter();

  companysubtypes = [];
  companysubtypesAll = [];
  companysubtype = {
    companysubtype_ID: 0,
    companytype_ID: null,
    companysubtype_NAME: null,
    companysubtype_DESC: null,
    isactive: true,
  }

  constructor(
    private companysubtypeservice: CompanysubtypeService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('companysubtypes') != null) {
      this.companysubtypes = JSON.parse(window.sessionStorage.getItem('companysubtypes'));
    }
    if (window.sessionStorage.getItem('companysubtypesAll') != null) {
      this.companysubtypesAll = JSON.parse(window.sessionStorage.getItem('companysubtypesAll'));
    }
    if (this.companysubtypeID != 0 && !this.companysubtypeID && Number(window.sessionStorage.getItem('companysubtype')) > 0) {
      this.companysubtypeID = Number(window.sessionStorage.getItem('companysubtype'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.companysubtypes == null || this.companysubtypes.length == 0 || reload == true)) {
      this.companysubtypes == null;
      this.companysubtypeGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.companysubtypesAll == null || this.companysubtypesAll.length == 0 || reload == true)) {
      this.companysubtypesAll == null;
      this.companysubtypeGetAll();
    }

    var search = {
      companytype_ID: this.companytypeID,
      companytype_CODE: this.companytypeCode,

    }
    if (this.view >= 5 && this.view <= 6 && this.companysubtypeID) {
      window.sessionStorage.setItem("companysubtype", this.companysubtypeID);
      this.companysubtypeGetOne(this.companysubtypeID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.companysubtypes == null || this.companysubtypes.length == 0 || reload == true)) {
      this.companysubtypes == null;
      this.companysubtypeAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.companysubtypesAll == null || this.companysubtypesAll.length == 0 || reload == true)) {
      this.companysubtypesAll == null;
      this.companysubtypeAdvancedSearchAll(search);
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
    this.companysubtype = {
      companysubtype_ID: 0,
      companytype_ID: null,
      companysubtype_NAME: null,
      companysubtype_DESC: null,
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

  companysubtypeEdit() {
    this.disabled = false;
  }

  companysubtypeCancel() {
    this.disabled = true;
    if (this.companysubtype.companysubtype_ID == 0) {
      this.router.navigate(["/home/companysubtypes"], {});
    }
  }

  onChange(companysubtypeID) {
    for (var i = 0; i < this.companysubtypesAll.length; i++) {
      if (this.companysubtypesAll[i].companysubtype_ID == companysubtypeID) {
        this.onCompanySubTypeChange.next(this.companysubtypesAll[i]);
        break;
      }
    }
  }

  setCompanysubtype(response) {
    this.companytypeID = response.companytype_ID;
    this.companysubtypeID = response.companysubtype_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.companysubtype = response;
  }

  setCompanysubtypes(response) {
    this.cancel.next();
    return response;
  }

  companysubtypeGet() {
    this.companysubtypeservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companysubtypes = this.setCompanysubtypes(this.companysubtypeservice.getAllDetail(response));
          window.sessionStorage.setItem("companysubtypes", JSON.stringify(this.companysubtypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companysubtypeGetAll() {
    this.companysubtypeservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companysubtypesAll = this.setCompanysubtypes(this.companysubtypeservice.getAllDetail(response));
          window.sessionStorage.setItem("companysubtypesAll", JSON.stringify(this.companysubtypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companysubtypeGetOne(id) {
    this.disabled = true;
    this.companysubtypeservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCompanysubtype(this.companysubtypeservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companysubtypeAdd(companysubtype) {
    // companysubtype.companytype_ID = this.companytype.companytypeID;
    companysubtype.isactive = "Y";

    this.companysubtypeservice.add(companysubtype).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.companysubtype_ID) {
          this.toastrservice.success("Success", "New Companysubtype Added");
          this.setCompanysubtype(this.companysubtypeservice.getDetail(response));
          this.refresh.next();
          this.companysubtypeGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companysubtypeUpdate(companysubtype) {
    // companysubtype.companytype_ID = this.companytype.companytypeID;

    if (companysubtype.isactive == true) {
      companysubtype.isactive = "Y";
    } else {
      companysubtype.isactive = "N";
    }
    this.companysubtypeservice.update(companysubtype, companysubtype.companysubtype_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.companysubtype_ID) {
          this.toastrservice.success("Success", "Companysubtype Updated");
          this.setCompanysubtype(this.companysubtypeservice.getDetail(response));
          this.refresh.next();
          this.companysubtypeGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companysubtypeUpdateAll(companysubtypes) {
    this.companysubtypeservice.updateAll(companysubtypes).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Companysubtypes Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companysubtypeSearch(str) {
    var search = {
      search: str
    }
    this.companysubtypeservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companysubtypes = this.setCompanysubtypes(this.companysubtypeservice.getAllDetail(response));
          window.sessionStorage.setItem("companysubtypes", JSON.stringify(this.companysubtypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companysubtypeSearchAll(str) {
    var search = {
      search: str
    }
    this.companysubtypeservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companysubtypesAll = this.setCompanysubtypes(this.companysubtypeservice.getAllDetail(response));
          window.sessionStorage.setItem("companysubtypesAll", JSON.stringify(this.companysubtypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companysubtypeAdvancedSearch(search) {
    this.companytypeID = search.companytype_ID;
    this.companytypeCode = search.companytype_CODE;

    this.companysubtypeservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companysubtypes = this.setCompanysubtypes(this.companysubtypeservice.getAllDetail(response));
          window.sessionStorage.setItem("companysubtypes", JSON.stringify(this.companysubtypes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companysubtypeAdvancedSearchAll(search) {
    this.companytypeID = search.companytype_ID;
    this.companytypeCode = search.companytype_CODE;

    this.companysubtypeservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companysubtypesAll = this.setCompanysubtypes(this.companysubtypeservice.getAllDetail(response));
          window.sessionStorage.setItem("companysubtypesAll", JSON.stringify(this.companysubtypesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
