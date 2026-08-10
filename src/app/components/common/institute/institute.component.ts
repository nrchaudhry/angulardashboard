import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { LocationsearchfilterComponent } from '../../location/locationsearchfilter/locationsearchfilter.component';
import { InstituteService } from './institute.service';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.css']
})
export class InstituteComponent implements OnInit {
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
  locationID = null;
  @Input()
  instituteID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onInstituteChange = new EventEmitter();

  institutes = [];
  institutesAll = [];
  institute = {
    institute_ID: 0,
    institute_CODE: null,
    institute_NAME: null,
    institute_DESCRIPTION: null,
    address_LINE1: null,
    address_LINE2: null,
    address_LINE3: null,
    address_LINE4: null,
    address_LINE5: null,
    address_POSTCODE: null,
    location_ID: null,
    locations: [],
    telephone: null,
    faxno: null,
    email: null,
    logo_PATH: null,
    icon_PATH: null,
    isactive: true,
  }

  constructor(
    private instituteservice: InstituteService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload) {
    if (window.sessionStorage.getItem('institutes') != null) {
      this.institutes = JSON.parse(window.sessionStorage.getItem('institutes'));
    }
    if (window.sessionStorage.getItem('institutesAll') != null) {
      this.institutesAll = JSON.parse(window.sessionStorage.getItem('institutesAll'));
    }
    if (this.instituteID != 0 && !this.instituteID && Number(window.sessionStorage.getItem('institute')) > 0) {
      this.instituteID = Number(window.sessionStorage.getItem('institute'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.institutes == null || this.institutes.length == 0 || reload == true)) {
      this.institutes == null;
      this.instituteGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.institutesAll == null || this.institutesAll.length == 0 || reload == true)) {
      this.institutesAll == null;
      this.instituteGetAll();
    }

    var search = {
      location_ID: this.locationID
    }
    if (this.view >= 5 && this.view <= 6 && this.instituteID) {
      window.sessionStorage.setItem("institute", this.instituteID);
      this.instituteGetOne(this.instituteID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.institutes == null || this.institutes.length == 0 || reload == true)) {
      this.institutes == null;
      this.instituteAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.institutesAll == null || this.institutesAll.length == 0 || reload == true)) {
      this.institutesAll == null;
      this.instituteAdvancedSearchAll(search);
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
    this.institute = {
      institute_ID: 0,
      institute_CODE: null,
      institute_NAME: null,
      institute_DESCRIPTION: null,
      address_LINE1: null,
      address_LINE2: null,
      address_LINE3: null,
      address_LINE4: null,
      address_LINE5: null,
      address_POSTCODE: null,
      location_ID: null,
      locations: [],
      telephone: null,
      faxno: null,
      email: null,
      logo_PATH: null,
      icon_PATH: null,
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

  instituteEdit() {
    this.disabled = false;
  }

  instituteCancel() {
    this.disabled = true;
    if (this.institute.institute_ID == 0) {
      this.router.navigate(["/home/institutes"], {});
    }
  }

  onChange(instituteID) {
    for (var i = 0; i < this.institutesAll.length; i++) {
      if (this.institutesAll[i].institute_ID == instituteID) {
        this.onInstituteChange.next(this.institutesAll[i]);
        break;
      }
    }
  }

  setInstitute(response) {
    this.instituteID = response.institute_ID;
    this.locationID = response.location_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.institute = response;
  }

  setInstitutees(response) {
    this.cancel.next();
    return response;
  }

  instituteGet() {
    this.instituteservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutes = this.setInstitutees(this.instituteservice.getAllDetail(response));
          window.sessionStorage.setItem("institutes", JSON.stringify(this.institutes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  instituteGetAll() {
    this.instituteservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutesAll = this.setInstitutees(this.instituteservice.getAllDetail(response));
          window.sessionStorage.setItem("institutesAll", JSON.stringify(this.institutesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  instituteGetOne(id) {
    this.disabled = true;
    this.instituteservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setInstitute(this.instituteservice.getDetail(response));
          if (this.locationsearchfilter != null)
            this.locationsearchfilter.setLocation(this.institute.locations);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  instituteAdd(institute) {
    institute.location_ID = this.locationsearchfilter.locationID;
    institute.isactive = "Y";

    this.instituteservice.add(institute).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.institute_ID) {
          this.toastrservice.success("Success", "New Institute Added");
          this.setInstitute(this.instituteservice.getDetail(response));
          this.refresh.next();
          this.instituteGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  instituteUpdate(institute) {
    institute.location_ID = this.locationsearchfilter.locationID;

    if (institute.isactive == true) {
      institute.isactive = "Y";
    } else {
      institute.isactive = "N";
    }
    this.instituteservice.update(institute, institute.institute_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.institute_ID) {
          this.toastrservice.success("Success", "Institute Updated");
          this.setInstitute(this.instituteservice.getDetail(response));
          this.refresh.next();
          this.instituteGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  instituteUpdateAll(institutes) {
    this.instituteservice.updateAll(institutes).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Institutes Updated");
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  instituteSearch(str) {
    var search = {
      search: str
    }
    this.instituteservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutes = this.setInstitutees(this.instituteservice.getAllDetail(response));
          window.sessionStorage.setItem("institutes", JSON.stringify(this.institutes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  instituteSearchAll(str) {
    var search = {
      search: str
    }
    this.instituteservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutesAll = this.setInstitutees(this.instituteservice.getAllDetail(response));
          window.sessionStorage.setItem("institutesAll", JSON.stringify(this.institutesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  instituteAdvancedSearch(search) {
    this.locationID = search.location_ID;
    this.instituteservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutes = this.setInstitutees(this.instituteservice.getAllDetail(response));
          window.sessionStorage.setItem("institutes", JSON.stringify(this.institutes));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  instituteAdvancedSearchAll(search) {
    this.locationID = search.location_ID;
    this.instituteservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.institutesAll = this.setInstitutees(this.instituteservice.getAllDetail(response));
          window.sessionStorage.setItem("institutesAll", JSON.stringify(this.institutesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
