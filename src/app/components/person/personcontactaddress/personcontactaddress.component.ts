import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { LocationsearchfilterComponent } from '../../location/locationsearchfilter/locationsearchfilter.component';

import { PersoncontactaddressService } from './personcontactaddress.service';
import { redirectByHref } from 'src/app/utilities/Shared_Funtions';
import { setting } from 'src/app/setting';

@Component({
  selector: 'app-personcontactaddress',
  templateUrl: './personcontactaddress.component.html',
  styleUrls: ['./personcontactaddress.component.css']
})
export class PersoncontactaddressComponent implements OnInit {
  @ViewChild("locationsearchfilter") locationsearchfilter: LocationsearchfilterComponent;

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
  personcontactaddressID = null;
  @Input()
  locationsearchfilterID = null;
  @Input()
  personID = null;
  @Input()
  locationID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersoncontactaddressChange = new EventEmitter();

  personcontactaddresses = [];
  personcontactaddressesAll = [];
  personcontactaddress = {
    personcontactaddress_ID: 0,
    person_ID: null,
    address_LINE1: null,
    address_LINE2: null,
    address_LINE3: null,
    address_LINE4: null,
    address_LINE5: null,
    address_POSTCODE: null,
    location_ID: null,
    ispermanent: false,
    isactive: true
  }

  constructor(
    private personcontactaddressservice: PersoncontactaddressService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (!this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    } else {
      redirectByHref(setting.redirctPath + "/#/home/personal");
    }

    if (window.sessionStorage.getItem('personcontactaddresses') != null) {
      this.personcontactaddresses = JSON.parse(window.sessionStorage.getItem('personcontactaddresses'));
    }
    if (window.sessionStorage.getItem('personcontactaddressesAll') != null) {
      this.personcontactaddressesAll = JSON.parse(window.sessionStorage.getItem('personcontactaddressesAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personcontactaddresses == null || this.personcontactaddresses.length == 0 || reload == true)) {
      this.personcontactaddresses == null;
      this.personcontactaddressGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personcontactaddressesAll == null || this.personcontactaddressesAll.length == 0 || reload == true)) {
      this.personcontactaddressesAll == null;
      this.personcontactaddressGetAll();
    }

    var search = {
      person_ID: this.personID,
      locationsearchfilter_ID: this.locationsearchfilterID,
    }
    if (this.view >= 5 && this.view <= 6 && this.personcontactaddressID) {
      window.sessionStorage.setItem("personcontactaddress", this.personcontactaddressID);
      this.personcontactaddressGetOne(this.personcontactaddressID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personcontactaddresses == null || this.personcontactaddresses.length == 0 || reload == true)) {
      this.personcontactaddresses == null;
      this.personcontactaddressAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personcontactaddressesAll == null || this.personcontactaddressesAll.length == 0 || reload == true)) {
      this.personcontactaddressesAll == null;
      this.personcontactaddressAdvancedSearchAll(search);
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

  onChange(personcontactaddressID) {
    for (var i = 0; i < this.personcontactaddressesAll.length; i++) {
      if (this.personcontactaddressesAll[i].personcontactaddress_ID == personcontactaddressID) {
        this.onPersoncontactaddressChange.next(this.personcontactaddressesAll[i]);
        break;
      }
    }
  }

  add() {
    this.personcontactaddress = {
      personcontactaddress_ID: 0,
      person_ID: null,
      address_LINE1: null,
      address_LINE2: null,
      address_LINE3: null,
      address_LINE4: null,
      address_LINE5: null,
      address_POSTCODE: null,
      location_ID: null,
      ispermanent: false,
      isactive: true
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

  personcontactaddressEdit() {
    this.disabled = false;
  }

  personcontactaddressCancel() {
    this.disabled = true;
    if (this.personcontactaddress.personcontactaddress_ID == 0) {
      this.router.navigate(["/home/personcontactaddresses"], {});
    }
  }

  setPersoncontactaddress(response) {
    this.personcontactaddressID = response.personcontactaddress_ID;
    this.personID = response.person_ID;
    this.locationID = response.location_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personcontactaddress = response;
  }

  setPersoncontactaddresses(response) {
    this.cancel.next();
    return response;
  }

  personcontactaddressGet() {
    this.personcontactaddressservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontactaddresses = this.setPersoncontactaddresses(this.personcontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontactaddresses", JSON.stringify(this.personcontactaddresses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactaddressGetAll() {
    this.personcontactaddressservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontactaddressesAll = this.setPersoncontactaddresses(this.personcontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontactaddressesAll", JSON.stringify(this.personcontactaddressesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactaddressGetOne(id) {
    this.disabled = true;
    this.personcontactaddressservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personcontactaddress_ID) {
          this.setPersoncontactaddress(this.personcontactaddressservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactaddressAdd(personcontactaddress) {
    personcontactaddress.person_ID = this.personID;
    personcontactaddress.location_ID = this.locationsearchfilter.locationID;

    personcontactaddress.isactive = "Y";

    this.personcontactaddressservice.add(personcontactaddress).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personcontactaddress_ID) {
          this.toastrservice.success("Success", "New Person Contact Address Added");
          this.setPersoncontactaddress(this.personcontactaddressservice.getDetail(response));
          this.refresh.next();
          this.personcontactaddressGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactaddressUpdate(personcontactaddress) {
    personcontactaddress.person_ID = this.personID;
    personcontactaddress.location_ID = this.locationsearchfilter.locationID;

    if (personcontactaddress.ispermanent == true) {
      personcontactaddress.ispermanent = "Y";
    } else {
      personcontactaddress.ispermanent = "N";
    }
    if (personcontactaddress.isactive == true) {
      personcontactaddress.isactive = "Y";
    } else {
      personcontactaddress.isactive = "N";
    }
    this.personcontactaddressservice.update(personcontactaddress, personcontactaddress.personcontactaddress_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personcontactaddress_ID) {
          this.toastrservice.success("Success", "Person Contact Address Updated");
          this.setPersoncontactaddress(this.personcontactaddressservice.getDetail(response));
          this.refresh.next();
          this.personcontactaddressGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactaddressUpdateAll(personcontactaddresses) {
    this.personcontactaddressservice.updateAll(personcontactaddresses).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Person Contact Addresses Updated");
          this.setPersoncontactaddress(this.personcontactaddressservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactaddressSearch(str) {
    var search = {
      search: str
    }
    this.personcontactaddressservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontactaddresses = this.setPersoncontactaddresses(this.personcontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontactaddresses", JSON.stringify(this.personcontactaddresses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactaddressSearchAll(str) {
    var search = {
      search: str
    }
    this.personcontactaddressservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontactaddressesAll = this.setPersoncontactaddresses(this.personcontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontactaddressesAll", JSON.stringify(this.personcontactaddressesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactaddressAdvancedSearch(search) {
    this.locationsearchfilterID = search.locationsearchfilter_ID;
    this.personID = search.person_ID;
    this.personcontactaddressservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontactaddresses = this.setPersoncontactaddresses(this.personcontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontactaddresses", JSON.stringify(this.personcontactaddresses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcontactaddressAdvancedSearchAll(search) {
    this.locationsearchfilterID = search.locationsearchfilter_ID;
    this.personID = search.person_ID;
    this.personcontactaddressservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcontactaddressesAll = this.setPersoncontactaddresses(this.personcontactaddressservice.getAllDetail(response));
          window.sessionStorage.setItem("personcontactaddressesAll", JSON.stringify(this.personcontactaddressesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
