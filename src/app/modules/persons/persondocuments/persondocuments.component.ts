import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { ActivatedRoute, Router } from '@angular/router';

import { PersondocumentComponent } from 'src/app/components/person/persondocument/persondocument.component';

declare var $: any;

@Component({
  selector: 'app-persondocuments',
  templateUrl: './persondocuments.component.html',
  styleUrls: ['./persondocuments.component.css']
})
export class PersondocumentsComponent implements OnInit {
  @ViewChild("persondocuments") persondocuments: PersondocumentComponent;
  @ViewChild("addpersondocument") addpersondocument: PersondocumentComponent;
  @ViewChild("editpersondocument") editpersondocument: PersondocumentComponent;

  personID = 0;

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  view() {
  }

  refresh() {
    this.persondocuments.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/document"], { queryParams: { persondocument: row.data.persondocument_ID } });
  }

  addNew() {
    this.router.navigate(["/home/document"], {});
    // this.addpersondocument.add();
    // $("#add").modal("show");
  }

  edit(row) {
    this.editpersondocument.persondocument = {
      persondocument_ID: row.data.persondocument_ID,
      person_ID: row.data.person_ID,
      document_PATH: row.data.document_PATH,
      filetype_ID: row.data.filetype_ID,
      documenttype_ID: row.data.documenttype_ID,
      documenttype_DESC: row.data.documenttype_DESC,
      is_VERIFIED: row.data.is_VERIFIED,
      is_ARCHIVED: row.data.is_ARCHIVED,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editpersondocument.persondocument.isactive = true;
    } else {
      this.editpersondocument.persondocument.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
