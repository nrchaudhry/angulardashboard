import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { resourceUsage } from 'process';
import { OnFailService } from '../../../services/on-fail.service';

import { CompanycontactaddressService } from './companycontactaddress.service';
import { CompanyComponent } from '../company/company.component';
import { LocationsearchfilterComponent } from '../../location/locationsearchfilter/locationsearchfilter.component';
import { AddresstypeComponent } from '../../lookup/common/addresstype/addresstype.component';

@Component({
  selector: 'app-companycontactaddress',
  templateUrl: './companycontactaddress.component.html',
  styleUrls: ['./companycontactaddress.component.css']
})
export class CompanycontactaddressComponent implements OnInit {
  @ViewChild("company") company: CompanyComponent;
  @ViewChild("locationsearchfilter") locationsearchfilter: LocationsearchfilterComponent;
  @ViewChild("addresstype") addresstype: AddresstypeComponent;

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
  companyID = null;
  @Input()
  locationID = null;
  @Input()
  addresstypeID = null;
  @Input()
  addresstypeCode = null;
  @Input()
  companycontactaddressID = null;
  @Input()
  companyDisabled: boolean = true;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onCompanyContactAddressChange = new EventEmitter();

  companycontactaddresses = [];
  companycontactaddressesAll = [];
  companycontactaddress = {
    companycontactaddress_ID: 0,
    company_ID: null,
    address_NAME: null,
    address_LINE1: null,
    address_LINE2: null,
    address_LINE3: null,
    address_LINE4: null,
    address_LINE5: null,
    address_POSTCODE: null,
    location_ID: null,
    locations: [],
    addresstype_ID: null,
    ispermanent: null,
    isactive: true,
  }

  constructor(
    private companycontactaddressservice: CompanycontactaddressService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('companycontactaddresses') != null) {
      this.companycontactaddresses = JSON.parse(window.sessionStorage.getItem('companycontactaddresses'));
    }
    if (window.sessionStorage.getItem('companycontactaddressesAll') != null) {
      this.companycontactaddressesAll = JSON.parse(window.sessionStorage.getItem('companycontactaddressesAll'));
    }
    if (this.companycontactaddressID != 0 && !this.companycontactaddressID && Number(window.sessionStorage.getItem('companycontactaddress')) > 0) {
      this.companycontactaddressID = Number(window.sessionStorage.getItem('companycontactaddress'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.companycontactaddresses == null || this.companycontactaddresses.length == 0 || reload == true)) {
      this.companycontactaddresses == null;
      this.companycontactaddressGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.companycontactaddressesAll == null || this.companycontactaddressesAll.length == 0 || reload == true)) {
      this.companycontactaddressesAll == null;
      this.companycontactaddressGetAll();
    }

    var search = {
      company_ID: this.companyID,
      location_ID: this.locationID,
      addresstype_ID: this.addresstypeID,
      addresstype_CODE: this.addresstypeCode,
    }
    if (this.view >= 5 && this.view <= 6 && this.companycontactaddressID) {
      window.sessionStorage.setItem("companycontactaddress", this.companycontactaddressID);
      this.companycontactaddressGetOne(this.companycontactaddressID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.companycontactaddresses == null || this.companycontactaddresses.length == 0 || reload == true)) {
      this.companycontactaddresses == null;
      this.companycontactaddressAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.companycontactaddressesAll == null || this.companycontactaddressesAll.length == 0 || reload == true)) {
      this.companycontactaddressesAll == null;
      this.companycontactaddressAdvancedSearchAll(search);
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
    this.companycontactaddress = {
      companycontactaddress_ID: 0,
      company_ID: null,
      address_NAME: null,
      address_LINE1: null,
      address_LINE2: null,
      address_LINE3: null,
      address_LINE4: null,
      address_LINE5: null,
      address_POSTCODE: null,
      location_ID: null,
      locations: [],
      addresstype_ID: null,
      ispermanent: null,
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

  companycontactaddressEdit() {
    this.disabled = false;
  }

  companycontactaddressCancel() {
    this.disabled = true;
    if (this.companycontactaddress.companycontactaddress_ID == 0) {
      this.router.navigate(["/home/companycontactaddresses"], {});
    }
  }

  onChange(companycontactaddressID) {
    for (var i = 0; i < this.companycontactaddressesAll.length; i++) {
      if (this.companycontactaddressesAll[i].companycontactaddress_ID == companycontactaddressID) {
        this.onCompanyContactAddressChange.next(this.companycontactaddressesAll[i]);
        break;
      }
    }
  }

  setCompanycontactaddress(response) {
    this.companycontactaddressID = response.companycontactaddress_ID;
    this.companyID = response.company_ID;
    this.locationID = response.location_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.companycontactaddress = response;
    if (this.locationsearchfilter != null)
      this.locationsearchfilter.setLocation(this.companycontactaddress.locations);
}

  setCompanycontactaddresses(response) {
    this.cancel.next();
    return response;
  }

  companycontactaddressGet() {
    this.companycontactaddressservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontactaddresses = this.setCompanycontactaddresses(this.companycontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontactaddresses", JSON.stringify(this.companycontactaddresses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactaddressGetAll() {
    this.companycontactaddressservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontactaddressesAll = this.setCompanycontactaddresses(this.companycontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontactaddressesAll", JSON.stringify(this.companycontactaddressesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactaddressGetOne(id) {
    this.disabled = true;
    this.companycontactaddressservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setCompanycontactaddress(this.companycontactaddressservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactaddressAdd(companycontactaddress) {
    companycontactaddress.company_ID = this.company.companyID;
    companycontactaddress.location_ID = this.locationsearchfilter.locationID;
    companycontactaddress.addresstype_ID = this.addresstype.addresstypeID;

    companycontactaddress.isactive = "Y";

    this.companycontactaddressservice.add(companycontactaddress).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.companycontactaddress_ID) {
          this.toastrservice.success("Success", "New Companycontactaddress Added");
          this.setCompanycontactaddress(this.companycontactaddressservice.getDetail(response));
          this.refresh.next();
          this.companycontactaddressGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactaddressUpdate(companycontactaddress) {
    companycontactaddress.company_ID = this.company.companyID;
    companycontactaddress.location_ID = this.locationsearchfilter.locationID;
    companycontactaddress.addresstype_ID = this.addresstype.addresstypeID;

    if (companycontactaddress.isactive == true) {
      companycontactaddress.isactive = "Y";
    } else {
      companycontactaddress.isactive = "N";
    }
    this.companycontactaddressservice.update(companycontactaddress, companycontactaddress.companycontactaddress_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.companycontactaddress_ID) {
          this.toastrservice.success("Success", "Companycontactaddress Updated");
          this.setCompanycontactaddress(this.companycontactaddressservice.getDetail(response));
          this.refresh.next();
          this.companycontactaddressGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactaddressUpdateAll(companycontactaddresss) {
    this.companycontactaddressservice.updateAll(companycontactaddresss).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Companycontactaddresses Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactaddressSearch(str) {
    var search = {
      search: str
    }
    this.companycontactaddressservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontactaddresses = this.setCompanycontactaddresses(this.companycontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontactaddresses", JSON.stringify(this.companycontactaddresses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactaddressSearchAll(str) {
    var search = {
      search: str
    }
    this.companycontactaddressservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontactaddressesAll = this.setCompanycontactaddresses(this.companycontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontactaddressesAll", JSON.stringify(this.companycontactaddressesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactaddressAdvancedSearch(search) {
    this.companyID = search.company_ID;
    this.locationID = search.location_ID;
    this.addresstypeID = search.addresstype_ID;
    this.addresstypeCode = search.addresstype_CODE;
    this.companycontactaddressservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontactaddresses = this.setCompanycontactaddresses(this.companycontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontactaddresses", JSON.stringify(this.companycontactaddresses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  companycontactaddressAdvancedSearchAll(search) {
    this.companyID = search.company_ID;
    this.locationID = search.location_ID;
    this.addresstypeID = search.addresstype_ID;
    this.addresstypeCode = search.addresstype_CODE;
    this.companycontactaddressservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.companycontactaddressesAll = this.setCompanycontactaddresses(this.companycontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("companycontactaddressesAll", JSON.stringify(this.companycontactaddressesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
