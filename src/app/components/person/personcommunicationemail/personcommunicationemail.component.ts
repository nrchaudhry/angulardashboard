import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { PersoncontactComponent } from '../personcontact/personcontact.component';
import { PersoncommunicationemailService } from './personcommunicationemail.service';
import { redirectByHref } from 'src/app/utilities/Shared_Funtions';
import { setting } from 'src/app/setting';

@Component({
  selector: 'app-personcommunicationemail',
  templateUrl: './personcommunicationemail.component.html',
  styleUrls: ['./personcommunicationemail.component.css']
})
export class PersoncommunicationemailComponent implements OnInit {
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
  personemailID = null;
  @Input()
  personID = null;
  @Input()
  personcontactID = null;

  public Editor = ClassicEditor;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersonCommunicationEmailChange = new EventEmitter();

  personcommunicationemails = [];
  personcommunicationemailsAll = [];
  personcommunicationemail = {
    personemail_ID: 0,
    email_DATETIME: null,
    email_CONTENT: null,
    personcontact_ID: null,
    isactive: true,
  }

  constructor(
    private personcommunicationemailservice: PersoncommunicationemailService,
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

    if (window.sessionStorage.getItem('personcommunicationemails') != null) {
      this.personcommunicationemails = JSON.parse(window.sessionStorage.getItem('personcommunicationemails'));
    }
    if (window.sessionStorage.getItem('personcommunicationemailsAll') != null) {
      this.personcommunicationemailsAll = JSON.parse(window.sessionStorage.getItem('personcommunicationemailsAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.personcommunicationemails == null || this.personcommunicationemails.length == 0 || reload == true)) {
      this.personcommunicationemails == null;
      this.personcommunicationemailGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.personcommunicationemailsAll == null || this.personcommunicationemailsAll.length == 0 || reload == true)) {
      this.personcommunicationemailsAll == null;
      this.personcommunicationemailGetAll();
    }

    var search = {
      personcontact_ID: this.personcontactID,
    }

    if (this.view >= 5 && this.view <= 6 && this.personemailID) {
      window.sessionStorage.setItem("personcommunicationemail", this.personemailID);
      this.personcommunicationemailGetOne(this.personemailID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.personcommunicationemails == null || this.personcommunicationemails.length == 0 || reload == true)) {
      this.personcommunicationemails == null;
      this.personcommunicationemailAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.personcommunicationemailsAll == null || this.personcommunicationemailsAll.length == 0 || reload == true)) {
      this.personcommunicationemailsAll == null;
      this.personcommunicationemailAdvancedSearchAll(search);
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
    this.personcommunicationemail = {
      personemail_ID: 0,
      email_DATETIME: null,
      email_CONTENT: null,
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

  personcommunicationemailEdit() {
    this.disabled = false;
  }

  personcommunicationemailCancel() {
    this.disabled = true;
    if (this.personcommunicationemail.personemail_ID == 0) {
      this.router.navigate(["/home/personcommunicationemails"], {});
    }
  }

  onChange(personemailID) {
    for (var i = 0; i < this.personcommunicationemailsAll.length; i++) {
      if (this.personcommunicationemailsAll[i].personcommunicationemail_ID == personemailID) {
        this.onPersonCommunicationEmailChange.next(this.personcommunicationemailsAll[i]);
        break;
      }
    }
  }

  setPersoncommunicationemail(response) {
    this.personemailID = response.personemail_ID;
    this.personcontactID = response.personcontact_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.personcommunicationemail = response;
  }

  setPersoncommunicationemails(response) {
    this.cancel.next();
    return response;
  }

  personcommunicationemailGet() {
    this.personcommunicationemailservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationemails = this.setPersoncommunicationemails(this.personcommunicationemailservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationemails", JSON.stringify(this.personcommunicationemails));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationemailGetAll() {
    this.personcommunicationemailservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationemailsAll = this.setPersoncommunicationemails(this.personcommunicationemailservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationemailsAll", JSON.stringify(this.personcommunicationemailsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationemailGetOne(id) {
    this.disabled = true;
    this.personcommunicationemailservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersoncommunicationemail(this.personcommunicationemailservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationemailAdd(personcommunicationemail) {
    personcommunicationemail.personcontact_ID = this.personcontact.personcontactID;
    personcommunicationemail.isactive = "Y";

    this.personcommunicationemailservice.add(personcommunicationemail).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personemail_ID) {
          this.toastrservice.success("Success", "New Person Communication Email Added");
          this.setPersoncommunicationemail(this.personcommunicationemailservice.getDetail(response));
          this.refresh.next();
          this.personcommunicationemailGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationemailUpdate(personcommunicationemail) {
    personcommunicationemail.personcontact_ID = this.personcontact.personcontactID;
    if (personcommunicationemail.isactive == true) {
      personcommunicationemail.isactive = "Y";
    } else {
      personcommunicationemail.isactive = "N";
    }
    this.personcommunicationemailservice.update(personcommunicationemail, personcommunicationemail.personemail_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.personemail_ID) {
          this.toastrservice.success("Success", "Person Communication Email Updated");
          this.setPersoncommunicationemail(this.personcommunicationemailservice.getDetail(response));
          this.refresh.next();
          this.personcommunicationemailGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationemailUpdateAll(personcommunicationemails) {
    this.personcommunicationemailservice.updateAll(personcommunicationemails).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Person Communication Email Updated");
          this.setPersoncommunicationemail(this.personcommunicationemailservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationemailSearch(str) {
    var search = {
      search: str
    }
    this.personcommunicationemailservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationemails = this.setPersoncommunicationemails(this.personcommunicationemailservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationemails", JSON.stringify(this.personcommunicationemails));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationemailSearchAll(str) {
    var search = {
      search: str
    }
    this.personcommunicationemailservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationemailsAll = this.setPersoncommunicationemails(this.personcommunicationemailservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationemailsAll", JSON.stringify(this.personcommunicationemailsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationemailAdvancedSearch(search) {
    this.personcontactID = search.personcontact_ID;
    this.personcommunicationemailservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationemails = this.setPersoncommunicationemails(this.personcommunicationemailservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationemails", JSON.stringify(this.personcommunicationemails));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  personcommunicationemailAdvancedSearchAll(search) {
    this.personcontactID = search.personcontact_ID;
    this.personcommunicationemailservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.personcommunicationemailsAll = this.setPersoncommunicationemails(this.personcommunicationemailservice.getAllDetail(response));
          window.sessionStorage.setItem("personcommunicationemailsAll", JSON.stringify(this.personcommunicationemailsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
