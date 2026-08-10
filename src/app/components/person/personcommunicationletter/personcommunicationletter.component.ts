import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { LettertemplateComponent } from '../../communication/lettertemplate/lettertemplate.component';
import { PersoncommunicationletterService } from './personcommunicationletter.service';
import { redirectByHref } from 'src/app/utilities/Shared_Funtions';
import { setting } from 'src/app/setting';

@Component({
  selector: 'app-personcommunicationletter',
  templateUrl: './personcommunicationletter.component.html',
  styleUrls: ['./personcommunicationletter.component.css']
})
export class PersoncommunicationletterComponent implements OnInit {
  @ViewChild("lettertemplate") lettertemplate: LettertemplateComponent;

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
  personletterID = null;
  @Input()
  lettertemplateID = null;
  @Input()
  personID = null;
  @Input()
  letterID = null;

  public Editor = ClassicEditor;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersonCommunicationLetterChange = new EventEmitter();

  personcommunicationletters = [];
  personcommunicationlettersAll = [];
  personcommunicationletter = {
    personletter_ID: 0,
    letter_DATE: null,
    letter_CONTENT: null,
    letter_REFNO: null,
    letter_REQUESTDATE: null,
    letter_ID: null,
    person_ID: null,
    isletterapproved: null,
    isactive: true,
  }

  constructor(
    private personcommunicationletterservice: PersoncommunicationletterService,
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

    if (window.sessionStorage.getItem('personcommunicationletters') != null) {
      this.personcommunicationletters = JSON.parse(window.sessionStorage.getItem('personcommunicationletters'));
    }
    if (window.sessionStorage.getItem('personcommunicationlettersAll') != null) {
      this.personcommunicationlettersAll = JSON.parse(window.sessionStorage.getItem('personcommunicationlettersAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personcommunicationletters == null || this.personcommunicationletters.length == 0 || reload == true)) {
      this.personcommunicationletters == null;
      this.personcommunicationletterGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personcommunicationlettersAll == null || this.personcommunicationlettersAll.length == 0 || reload == true)) {
      this.personcommunicationlettersAll == null;
      this.personcommunicationletterGetAll();
    }

    var search = {
      lettertemplate_ID: this.lettertemplateID,
    }

    if (this.view >= 5 && this.view <= 6 && this.personletterID) {
      window.sessionStorage.setItem("personcommunicationletter", this.personletterID);
      this.personcommunicationletterGetOne(this.personletterID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personcommunicationletters == null || this.personcommunicationletters.length == 0 || reload == true)) {
      this.personcommunicationletters == null;
      this.personcommunicationletterAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personcommunicationlettersAll == null || this.personcommunicationlettersAll.length == 0 || reload == true)) {
      this.personcommunicationlettersAll == null;
      this.personcommunicationletterAdvancedSearchAll(search);
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
    this.personcommunicationletter = {
      personletter_ID: 0,
      letter_DATE: null,
      letter_CONTENT: null,
      letter_REFNO: null,
      letter_REQUESTDATE: null,
      letter_ID: null,
      person_ID: null,
      isletterapproved: null,
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

  personcommunicationletterEdit() {
    this.disabled = false;
  }

  personcommunicationletterCancel() {
    this.disabled = true;
    if (this.personcommunicationletter.personletter_ID == 0) {
      this.router.navigate(["/home/personcommunicationletters"], {});
    }
  }

  onChange(personcommunicationletterID) {
    for (var i = 0; i < this.personcommunicationlettersAll.length; i++) {
      if (this.personcommunicationlettersAll[i].personcommunicationletter_ID == personcommunicationletterID) {
        this.onPersonCommunicationLetterChange.next(this.personcommunicationlettersAll[i]);
        break;
      }
    }
  }

  setPersoncommunicationletter(response) {
    this.personletterID = response.personletter_ID;
    this.letterID = response.letter_ID;
    this.personID = response.person_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personcommunicationletter = response;
  }

  setPersoncommunicationletters(response) {
    this.cancel.next();
    return response;
  }

  personcommunicationletterGet() {
    this.personcommunicationletterservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationletters = this.setPersoncommunicationletters(this.personcommunicationletterservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationletters", JSON.stringify(this.personcommunicationletters));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationletterGetAll() {
    this.personcommunicationletterservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationlettersAll = this.setPersoncommunicationletters(this.personcommunicationletterservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationlettersAll", JSON.stringify(this.personcommunicationlettersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationletterGetOne(id) {
    this.disabled = true;
    this.personcommunicationletterservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersoncommunicationletter(this.personcommunicationletterservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationletterAdd(personcommunicationletter) {
    personcommunicationletter.letter_ID = this.lettertemplate.letterID;
    personcommunicationletter.person_ID = this.personID;
    personcommunicationletter.isactive = "Y";

    this.personcommunicationletterservice.add(personcommunicationletter).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personletter_ID) {
          this.toastrservice.success("Success", "New Person Communication Letter Added");
          this.setPersoncommunicationletter(this.personcommunicationletterservice.getDetail(response));
          this.refresh.next();
          this.personcommunicationletterGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationletterUpdate(personcommunicationletter) {
    personcommunicationletter.letter_ID = this.lettertemplate.letterID;
    personcommunicationletter.person_ID = this.personID;
    if (personcommunicationletter.isactive == true) {
      personcommunicationletter.isactive = "Y";
    } else {
      personcommunicationletter.isactive = "N";
    }
    this.personcommunicationletterservice.update(personcommunicationletter, personcommunicationletter.personletter_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personletter_ID) {
          this.toastrservice.success("Success", "Person Communication Letter Updated");
          this.setPersoncommunicationletter(this.personcommunicationletterservice.getDetail(response));
          this.refresh.next();
          this.personcommunicationletterGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationletterUpdateAll(personcommunicationletters) {
    this.personcommunicationletterservice.updateAll(personcommunicationletters).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Person Communication Letters Updated");
          this.setPersoncommunicationletter(this.personcommunicationletterservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationletterSearch(str) {
    var search = {
      search: str
    }
    this.personcommunicationletterservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationletters = this.setPersoncommunicationletters(this.personcommunicationletterservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationletters", JSON.stringify(this.personcommunicationletters));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationletterSearchAll(str) {
    var search = {
      search: str
    }
    this.personcommunicationletterservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationlettersAll = this.setPersoncommunicationletters(this.personcommunicationletterservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationlettersAll", JSON.stringify(this.personcommunicationlettersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationletterAdvancedSearch(search) {
    this.lettertemplateID = search.lettertemplate_ID;
    this.personcommunicationletterservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationletters = this.setPersoncommunicationletters(this.personcommunicationletterservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationletters", JSON.stringify(this.personcommunicationletters));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationletterAdvancedSearchAll(search) {
    this.lettertemplateID = search.lettertemplate_ID;
    this.personcommunicationletterservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationlettersAll = this.setPersoncommunicationletters(this.personcommunicationletterservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationlettersAll", JSON.stringify(this.personcommunicationlettersAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
