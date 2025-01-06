import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { PersonComponent } from '../person/person.component';

import { PersondocumentService } from './persondocument.service';
import { redirectByHref } from 'src/app/utilities/Shared_Funtions';
import { setting } from 'src/app/setting';
import { FiletypeComponent } from '../../common/filetype/filetype.component';
import { DocumenttypeComponent } from '../../lookup/person/documenttype/documenttype.component';

@Component({
  selector: 'app-persondocument',
  templateUrl: './persondocument.component.html',
  styleUrls: ['./persondocument.component.css']
})
export class PersondocumentComponent implements OnInit {
  @ViewChild("filetype") filetype: FiletypeComponent;
  @ViewChild("documenttype") documenttype: DocumenttypeComponent;

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
  persondocumentID = null;
  @Input()
  filetypeID = null;
  @Input()
  filetypeCode = null;
  @Input()
  personID = null;
  @Input()
  documenttypeID = null;
  @Input()
  documenttypeCode = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onPersonDocumentChange = new EventEmitter();

  persondocuments = [];
  persondocumentsAll = [];
  persondocument = {
    persondocument_ID: 0,
    person_ID: null,
    document_PATH: null,
    filetype_ID: null,
    documenttype_ID: null,
    documenttype_DESC: null,
    is_VERIFIED: false,
    is_ARCHIVED: false,
    isactive: true,
  }

  constructor(
    private persondocumentservice: PersondocumentService,
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

    if (window.sessionStorage.getItem('persondocuments') != null) {
      this.persondocuments = JSON.parse(window.sessionStorage.getItem('persondocuments'));
    }
    if (window.sessionStorage.getItem('persondocumentsAll') != null) {
      this.persondocumentsAll = JSON.parse(window.sessionStorage.getItem('persondocumentsAll'));
    }
    if (this.personID != 0 && !this.personID && Number(window.sessionStorage.getItem('person')) > 0) {
      this.personID = Number(window.sessionStorage.getItem('person'));
    }

    if (this.view >= 1 && this.view <= 2 && (this.persondocuments == null || this.persondocuments.length == 0 || reload == true)) {
      this.persondocuments == null;
      this.persondocumentGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.persondocumentsAll == null || this.persondocumentsAll.length == 0 || reload == true)) {
      this.persondocumentsAll == null;
      this.persondocumentGetAll();
    }

    var search = {
      person_ID: this.personID,
      filetype_ID: this.filetypeID,
      filetype_CODE: this.filetypeCode,
      documenttype_ID: this.documenttypeID,
      documenttype_CODE: this.documenttypeCode,
    }
    if (this.view >= 5 && this.view <= 6 && this.persondocumentID) {
      window.sessionStorage.setItem("persondocument", this.persondocumentID);
      this.persondocumentGetOne(this.persondocumentID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.persondocuments == null || this.persondocuments.length == 0 || reload == true)) {
      this.persondocuments == null;
      this.persondocumentAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.persondocumentsAll == null || this.persondocumentsAll.length == 0 || reload == true)) {
      this.persondocumentsAll == null;
      this.persondocumentAdvancedSearchAll(search);
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

  onChange(persondocumentID) {
    for (var i = 0; i < this.persondocumentsAll.length; i++) {
      if (this.persondocumentsAll[i].persondocument_ID == persondocumentID) {
        this.onPersonDocumentChange.next(this.persondocumentsAll[i]);
        break;
      }
    }
  }

  add() {
    this.persondocument = {
      persondocument_ID: 0,
      person_ID: null,
      document_PATH: null,
      filetype_ID: {
        id: null,
      },
      documenttype_ID: {
        id: null,
      },
      documenttype_DESC: null,
      is_VERIFIED: false,
      is_ARCHIVED: false,
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

  persondocumentEdit() {
    this.disabled = false;
  }

  persondocumentCancel() {
    this.disabled = true;
    if (this.persondocument.persondocument_ID == 0) {
      this.router.navigate(["/home/persondocuments"], {});
    }
  }

  setPersondocument(response) {
    this.persondocumentID = response.persondocument_ID;
    this.personID = response.person_ID;
    this.filetypeID = response.filetype_ID;
    this.documenttypeID = response.documenttype_ID;
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.persondocument = response;
  }

  setPersondocuments(response) {
    this.cancel.next();
    return response;
  }

  persondocumentGet() {
    this.persondocumentservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.persondocuments = this.setPersondocuments(this.persondocumentservice.getAllDetail(response));
          window.sessionStorage.setItem("persondocuments", JSON.stringify(this.persondocuments));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  persondocumentGetAll() {
    this.persondocumentservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.persondocumentsAll = this.setPersondocuments(this.persondocumentservice.getAllDetail(response));
          window.sessionStorage.setItem("persondocumentsAll", JSON.stringify(this.persondocumentsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  persondocumentGetOne(id) {
    this.disabled = true;
    this.persondocumentservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersondocument(this.persondocumentservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  persondocumentAdd(persondocument) {
    persondocument.filetype_ID = this.filetype.filetypeID;
    persondocument.documenttype_ID = this.documenttype.documenttypeID;
    persondocument.person_ID = this.personID;
    persondocument.isactive = "Y";

    this.persondocumentservice.add(persondocument).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.persondocument_ID) {
          this.toastrservice.success("Success", "New Person Document Added");
          this.setPersondocument(this.persondocumentservice.getDetail(response));
          this.refresh.next();
          this.persondocumentGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  persondocumentUpdate(persondocument) {
    persondocument.filetype_ID = this.filetype.filetypeID;
    persondocument.documenttype_ID = this.documenttype.documenttypeID;
    persondocument.person_ID = this.personID;
    if (persondocument.isactive == true) {
      persondocument.isactive = "Y";
    } else {
      persondocument.isactive = "N";
    }
    this.persondocumentservice.update(persondocument, persondocument.persondocument_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.persondocument_ID) {
          this.toastrservice.success("Success", "Person Document Updated");
          this.setPersondocument(this.persondocumentservice.getDetail(response));
          this.refresh.next();
          this.persondocumentGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  persondocumentUpdateAll(persondocuments) {
    this.persondocumentservice.updateAll(persondocuments).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Person Documents Updated");
          this.setPersondocument(this.persondocumentservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  persondocumentSearch(str) {
    var search = {
      search: str
    }
    this.persondocumentservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.persondocuments = this.setPersondocuments(this.persondocumentservice.getAllDetail(response));
          window.sessionStorage.setItem("persondocuments", JSON.stringify(this.persondocuments));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  persondocumentSearchAll(str) {
    var search = {
      search: str
    }
    this.persondocumentservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.persondocumentsAll = this.setPersondocuments(this.persondocumentservice.getAllDetail(response));
          window.sessionStorage.setItem("persondocumentsAll", JSON.stringify(this.persondocumentsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  persondocumentAdvancedSearch(search) {
    this.filetypeID = search.filetype_ID;
    this.filetypeCode = search.filetype_CODE;
    this.documenttypeID = search.documenttype_ID;
    this.documenttypeCode = search.documenttype_CODE;
    this.personID = search.person_ID;
    this.persondocumentservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.persondocuments = this.setPersondocuments(this.persondocumentservice.getAllDetail(response));
          window.sessionStorage.setItem("persondocuments", JSON.stringify(this.persondocuments));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  persondocumentAdvancedSearchAll(search) {
    this.filetypeID = search.filetype_ID;
    this.filetypeCode = search.filetype_CODE;
    this.documenttypeID = search.documenttype_ID;
    this.documenttypeCode = search.documenttype_CODE;
    this.personID = search.person_ID;
    this.persondocumentservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.persondocumentsAll = this.setPersondocuments(this.persondocumentservice.getAllDetail(response));
          window.sessionStorage.setItem("persondocumentsAll", JSON.stringify(this.persondocumentsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
