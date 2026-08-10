import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { PersoncontactComponent } from '../personcontact/personcontact.component';
import { PersoncommunicationsmsService } from './personcommunicationsms.service';
import { redirectByHref } from 'src/app/utilities/Shared_Funtions';
import { setting } from 'src/app/setting';

@Component({
  selector: 'app-personcommunicationsms',
  templateUrl: './personcommunicationsms.component.html',
  styleUrls: ['./personcommunicationsms.component.css']
})
export class PersoncommunicationsmsComponent implements OnInit {
  @ViewChild("personcontact") personcontact: PersoncontactComponent;

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
  personsmsID = null;
  @Input()
  personID = null;
  @Input()
  personcontactID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersonCommunicationSMSChange = new EventEmitter();

  public Editor = ClassicEditor;

  personcommunicationsmses = [];
  personcommunicationsmsesAll = [];
  personcommunicationsms = {
    personsms_ID: 0,
    sms_DATETIME: null,
    sms_CONTENT: null,
    personcontact_ID: null,
    isactive: true,
  }

  constructor(
    private personcommunicationsmseservice: PersoncommunicationsmsService,
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
      redirectByHref(setting.redirctPath + "/#/home/communications");
    }

    if (window.sessionStorage.getItem('personcommunicationsmses') != null) {
      this.personcommunicationsmses = JSON.parse(window.sessionStorage.getItem('personcommunicationsmses'));
    }
    if (window.sessionStorage.getItem('personcommunicationsmsesAll') != null) {
      this.personcommunicationsmsesAll = JSON.parse(window.sessionStorage.getItem('personcommunicationsmsesAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personcommunicationsmses == null || this.personcommunicationsmses.length == 0 || reload == true)) {
      this.personcommunicationsmses == null;
      this.personcommunicationsmsGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personcommunicationsmsesAll == null || this.personcommunicationsmsesAll.length == 0 || reload == true)) {
      this.personcommunicationsmsesAll == null;
      this.personcommunicationsmsGetAll();
    }

    var search = {
      personcontact_ID: this.personcontactID,
    }

    if (this.view >= 5 && this.view <= 6 && this.personsmsID) {
      window.sessionStorage.setItem("personcommunicationsms", this.personsmsID);
      this.personcommunicationsmsGetOne(this.personsmsID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personcommunicationsmses == null || this.personcommunicationsmses.length == 0 || reload == true)) {
      this.personcommunicationsmses == null;
      this.personcommunicationsmsAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personcommunicationsmsesAll == null || this.personcommunicationsmsesAll.length == 0 || reload == true)) {
      this.personcommunicationsmsesAll == null;
      this.personcommunicationsmsAdvancedSearchAll(search);
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
    this.personcommunicationsms = {
      personsms_ID: 0,
      sms_DATETIME: null,
      sms_CONTENT: null,
      personcontact_ID: null,
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

  personcommunicationsmsEdit() {
    this.disabled = false;
  }

  personcommunicationsmsCancel() {
    this.disabled = true;
    if (this.personcommunicationsms.personsms_ID == 0) {
      this.router.navigate(["/home/personcommunicationsmses"], {});
    }
  }

  onChange(personsmsID) {
    for (var i = 0; i < this.personcommunicationsmsesAll.length; i++) {
      if (this.personcommunicationsmsesAll[i].personcommunicationsms_ID == personsmsID) {
        this.onPersonCommunicationSMSChange.next(this.personcommunicationsmsesAll[i]);
        break;
      }
    }
  }

  setPersoncommunicationsms(response) {
    this.personsmsID = response.personsms_ID;
    this.personcontactID = response.personcontact_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personcommunicationsms = response;
  }

  setPersoncommunicationsmss(response) {
    this.cancel.next();
    return response;
  }

  personcommunicationsmsGet() {
    this.personcommunicationsmseservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationsmses = this.setPersoncommunicationsmss(this.personcommunicationsmseservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationsmses", JSON.stringify(this.personcommunicationsmses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationsmsGetAll() {
    this.personcommunicationsmseservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationsmsesAll = this.setPersoncommunicationsmss(this.personcommunicationsmseservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationsmsesAll", JSON.stringify(this.personcommunicationsmsesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationsmsGetOne(id) {
    this.disabled = true;
    this.personcommunicationsmseservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersoncommunicationsms(this.personcommunicationsmseservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationsmsAdd(personcommunicationsms) {
    personcommunicationsms.personcontact_ID = this.personcontact.personcontactID;
    personcommunicationsms.isactive = "Y";

    this.personcommunicationsmseservice.add(personcommunicationsms).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personsms_ID) {
          this.toastrservice.success("Success", "New Person Communication SMS Added");
          this.setPersoncommunicationsms(this.personcommunicationsmseservice.getDetail(response));
          this.refresh.next();
          this.personcommunicationsmsGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationsmsUpdate(personcommunicationsms) {
    personcommunicationsms.personcontact_ID = this.personcontact.personcontactID;
    if (personcommunicationsms.isactive == true) {
      personcommunicationsms.isactive = "Y";
    } else {
      personcommunicationsms.isactive = "N";
    }
    this.personcommunicationsmseservice.update(personcommunicationsms, personcommunicationsms.personsms_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personsms_ID) {
          this.toastrservice.success("Success", "Person Communication SMS Updated");
          this.setPersoncommunicationsms(this.personcommunicationsmseservice.getDetail(response));
          this.refresh.next();
          this.personcommunicationsmsGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationsmsUpdateAll(personcommunicationsmses) {
    this.personcommunicationsmseservice.updateAll(personcommunicationsmses).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Person Communication SMSS Updated");
          this.setPersoncommunicationsms(this.personcommunicationsmseservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationsmsSearch(str) {
    var search = {
      search: str
    }
    this.personcommunicationsmseservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationsmses = this.setPersoncommunicationsmss(this.personcommunicationsmseservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationsmses", JSON.stringify(this.personcommunicationsmses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationsmsSearchAll(str) {
    var search = {
      search: str
    }
    this.personcommunicationsmseservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationsmsesAll = this.setPersoncommunicationsmss(this.personcommunicationsmseservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationsmsesAll", JSON.stringify(this.personcommunicationsmsesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationsmsAdvancedSearch(search) {
    this.personcontactID = search.personcontact_ID;
    this.personcommunicationsmseservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationsmses = this.setPersoncommunicationsmss(this.personcommunicationsmseservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationsmses", JSON.stringify(this.personcommunicationsmses));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationsmsAdvancedSearchAll(search) {
    this.personcontactID = search.personcontact_ID;
    this.personcommunicationsmseservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationsmsesAll = this.setPersoncommunicationsmss(this.personcommunicationsmseservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationsmsesAll", JSON.stringify(this.personcommunicationsmsesAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
