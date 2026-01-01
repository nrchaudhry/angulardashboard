import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { EventService } from './event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
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
  eventtypeID = null;
  @Input()
  eventID = null;
  @Input()
  businessnatureID = null;
  @Input()
  businessnatureCode = null;
  @Input()
  eventstatusID = null;
  @Input()
  eventstatusCode = null;
  @Input()
  eventparentID = null;
  @Input()
  eventparentCode = null;
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
  @Output() onEventChange = new EventEmitter();

  companies = [];
  companiesAll = [];
  event = {
    event_ID: 0,
    isactive: true,
  }

  constructor(
    private companieservice: EventService,
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
    if (this.eventID != 0 && !this.eventID && Number(window.sessionStorage.getItem('event')) > 0) {
      this.eventID = Number(window.sessionStorage.getItem('event'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.companies == null || this.companies.length == 0 || reload == true)) {
      this.companies == null;
      this.eventGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.companiesAll == null || this.companiesAll.length == 0 || reload == true)) {
      this.companiesAll == null;
      this.eventGetAll();
    }

    var search = {
      eventtype_ID: this.eventtypeID,
      netsuite_ID: this.netsuiteID,
      netsuite_CODE: this.netsuiteCode,
      businessnature_ID: this.businessnatureID,
      businessnature_CODE: this.businessnatureCode,
      eventstatus_ID: this.eventstatusID,
      eventstatus_CODE: this.eventstatusCode,
      eventparent_ID: this.eventparentID,
      eventparent_CODE: this.eventparentCode,
    }
    if (this.view >= 5 && this.view <= 6 && this.eventID) {
      window.sessionStorage.setItem("event", this.eventID);
      this.eventGetOne(this.eventID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.companies == null || this.companies.length == 0 || reload == true)) {
      this.companies == null;
      this.eventAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.companiesAll == null || this.companiesAll.length == 0 || reload == true)) {
      this.companiesAll == null;
      this.eventAdvancedSearchAll(search);
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

  onChange(eventID) {
    for (var i = 0; i < this.companiesAll.length; i++) {
      if (this.companiesAll[i].event_ID == eventID) {
        this.onEventChange.next(this.companiesAll[i]);
        break;
      }
    }
  }

  add() {
    this.event = {
      event_ID: 0,
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

  eventEdit() {
    this.disabled = false;
  }

  eventCancel() {
    this.disabled = true;
    if (this.event.event_ID == 0) {
      this.router.navigate(["/home/companies"], {});
    }
  }

  setEvent(response) {
    this.eventID = response.event_ID;
    this.netsuiteID = response.netsuite_ID;
    this.businessnatureID = response.businessnature_ID;
    this.eventparentID = response.eventparent_ID;
    this.eventstatusID = response.eventstatus_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.event = response;
  }

  setCompanies(response) {
    this.cancel.next();
    return response;
  }

  eventGet() {
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

  eventGetAll() {
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

  eventGetOne(id) {
    this.disabled = true;
    this.companieservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setEvent(this.companieservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  eventAdd(event) {
    event.isactive = "Y";

    this.companieservice.add(event).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.event_ID) {
          this.toastrservice.success("Success", "New Intake Course Added");
          this.setEvent(this.companieservice.getDetail(response));
          this.refresh.next();
          this.eventGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  eventUpdate(event) {
    if (event.isactive == true) {
      event.isactive = "Y";
    } else {
      event.isactive = "N";
    }
    this.companieservice.update(event, event.event_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.event_ID) {
          this.toastrservice.success("Success", "Intake Course Updated");
          this.setEvent(this.companieservice.getDetail(response));
          this.refresh.next();
          this.eventGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  eventUpdateAll(companies) {
    this.companieservice.updateAll(companies).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Intake Courses Updated");
          this.setEvent(this.companieservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  eventSearch(str) {
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

  eventSearchAll(str) {
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

  eventAdvancedSearch(search) {
    this.eventtypeID = search.eventtype_ID;
    this.netsuiteID = search.netsuite_ID;
    this.netsuiteCode = search.netsuite_CODE;
    this.businessnatureID = search.businessnature_ID;
    this.businessnatureCode = search.businessnature_CODE;
    this.eventparentID = search.eventparent_ID;
    this.eventparentCode = search.eventparent_CODE;
    this.eventstatusID = search.eventstatus_ID;
    this.eventstatusCode = search.eventstatus_CODE;
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

  eventAdvancedSearchAll(search) {
    this.eventtypeID = search.eventtype_ID;
    this.netsuiteID = search.netsuite_ID;
    this.netsuiteCode = search.netsuite_CODE;
    this.businessnatureID = search.businessnature_ID;
    this.businessnatureCode = search.businessnature_CODE;
    this.eventparentID = search.eventparent_ID;
    this.eventparentCode = search.eventparent_CODE;
    this.eventstatusID = search.eventstatus_ID;
    this.eventstatusCode = search.eventstatus_CODE;
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
