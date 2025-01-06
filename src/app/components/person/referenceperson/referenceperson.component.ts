import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { setting } from 'src/app/setting';
import { redirectByHref } from '../../../utilities/Shared_Funtions';

import { OnFailService } from '../../../services/on-fail.service';
import { PersonComponent } from '../person/person.component';

import { ReferencepersonService } from './referenceperson.service';

@Component({
  selector: 'app-referenceperson',
  templateUrl: './referenceperson.component.html',
  styleUrls: ['./referenceperson.component.css']
})
export class ReferencepersonComponent implements OnInit {
  @ViewChild("person") person: PersonComponent;

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
  personID = null;
  @Input()
  referencepersonID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() onreferencepersonChange = new EventEmitter();

  contacttypes = [];
  referencepersons = [];
  referencepersonsAll = [];
  referenceperson = {
    referenceperson_ID: 0,
    person_ID: null,
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

  constructor(
    private referencepersonservice: ReferencepersonService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.load(this.isreload);
  }

  load(reload): void {
    if (this.view >= 1 && this.view <= 2 && (this.referencepersons == null || this.referencepersons.length == 0 || reload == true)) {
      this.referencepersons == null;
      this.referencepersonGet();
    }
    if (((this.view >= 1 && this.view <= 2) || this.view == 10) && (this.referencepersonsAll == null || this.referencepersonsAll.length == 0 || reload == true)) {
      this.referencepersonsAll == null;
      this.referencepersonGetAll();
    }

    var search = {
      person_ID: this.personID,
    }

    if (this.view >= 5 && this.view <= 6 && this.referencepersonID) {
      window.sessionStorage.setItem("referenceperson", this.referencepersonID);
      this.referencepersonGetOne(this.referencepersonID);
      this.disabled = true;
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == false && (this.referencepersons == null || this.referencepersons.length == 0 || reload == true)) {
      this.referencepersons == null;
      this.referencepersonAdvancedSearch(search);
    } else if ((this.view >= 11 && this.view <= 29) && this.disabled == true && (this.referencepersonsAll == null || this.referencepersonsAll.length == 0 || reload == true)) {
      this.referencepersonsAll == null;
      this.referencepersonAdvancedSearchAll(search);
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
    this.referenceperson = {
      referenceperson_ID: 0,
      person_ID: 0,
    };
  }

  update(row) {
    this.edit.next(row);
  }

  referencepersonEdit() {
    this.disabled = false;
  }

  referencepersonCancel() {
    this.disabled = true;
    if (this.referenceperson.referenceperson_ID == 0) {
      this.router.navigate(["/home/referencepersons"], {});
    }
  }

  onChange(personequalityID) {
    for (var i = 0; i < this.referencepersonsAll.length; i++) {
      if (this.referencepersonsAll[i].personequality_ID == personequalityID) {
        this.onreferencepersonChange.next(this.referencepersonsAll[i]);
        break;
      }
    }
  }

  setPersonReference(response) {
    this.personID = response.person_ID;
    this.referencepersonID = response.referenceperson_ID;

    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.referenceperson = response;
    this.disabled = true;
  }

  setPersonReferences(response) {
    this.cancel.next();
    return response;
  }

  referencepersonGet() {
    this.referencepersonservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.referencepersonservice.getAllDetail(response));
          window.sessionStorage.setItem("referencepersons", JSON.stringify(this.referencepersons));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencepersonGetOne(id) {
    this.referencepersonservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReference(this.referencepersonservice.getDetail(response));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencepersonGetAll() {
    this.referencepersonservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.referencepersonservice.getAllDetail(response));
          window.sessionStorage.setItem("referencepersonsAll", JSON.stringify(this.referencepersonsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencepersonAdd(referenceperson) {
    referenceperson.person_ID = this.personID;
    this.referencepersonservice.add(referenceperson).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.referenceperson_ID) {
          this.toastrservice.success("Success", "New Reference Person Added");
          this.setPersonReference(this.referencepersonservice.getDetail(response));
          this.refresh.next();
          this.referencepersonGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencepersonUpdate(referenceperson) {
    referenceperson.person_ID = this.personID;
    if (referenceperson.isactive == true) {
      referenceperson.isactive = "Y";
    } else {
      referenceperson.isactive = "N";
    }
    this.referencepersonservice.update(referenceperson, referenceperson.referenceperson_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.referenceperson_ID) {
          this.toastrservice.success("Success", " Reference Person Updated");
          this.setPersonReference(this.referencepersonservice.getDetail(response));
          this.refresh.next();
          this.referencepersonGetAll();
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencepersonUpdateAll(referencepersons) {
    this.referencepersonservice.updateAll(referencepersons).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.length > 0) {
          this.toastrservice.success("Success", "Persons Updated");
          this.setPersonReference(this.referencepersonservice.getDetail(response));
          this.refresh.next();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencepersonSearch(str) {
    var search = {
      search: str
    }
    this.referencepersonservice.search(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.referencepersonservice.getAllDetail(response));
          window.sessionStorage.setItem("referencepersons", JSON.stringify(this.referencepersons));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencepersonSearchAll(str) {
    var search = {
      search: str
    }
    this.referencepersonservice.searchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.referencepersonservice.getAllDetail(response));
          window.sessionStorage.setItem("referencepersonsAll", JSON.stringify(this.referencepersonsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencepersonAdvancedSearch(search) {
    this.personID = search.personID;

    this.referencepersonservice.advancedSearch(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.referencepersonservice.getAllDetail(response));
          window.sessionStorage.setItem("referencepersons", JSON.stringify(this.referencepersons));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  referencepersonAdvancedSearchAll(search) {
    this.personID = search.personID;

    this.referencepersonservice.advancedSearchAll(search).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else {
          this.setPersonReferences(this.referencepersonservice.getAllDetail(response));
          window.sessionStorage.setItem("referencepersonsAll", JSON.stringify(this.referencepersonsAll));
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

}
