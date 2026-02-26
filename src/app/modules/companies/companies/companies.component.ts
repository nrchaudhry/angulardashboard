import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

import { CompanyComponent } from 'src/app/components/company/company/company.component';

declare var $: any;

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  @ViewChild("companies") companies: CompanyComponent;
  @ViewChild("addcompany") addcompany: CompanyComponent;
  @ViewChild("editcompany") editcompany: CompanyComponent;

  spinnercount = 0;

  constructor(
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  refresh() {
    this.companies.load(true);
    this.cancel();
  }

  show(row) {
    this.router.navigate(["/home/company"], { queryParams: { company: row.data.company_ID } });
  }

  addNew() {
    this.addcompany.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editcompany.company = {
      company_ID: row.data.company_ID,
      company_CODE: row.data.company_CODE,
      company_NAME: row.data.company_NAME,
      company_DESC: row.data.company_DESC,
      registered_NUMBER: row.data.registered_NUMBER,
      tax_NUMBER: row.data.tax_NUMBER,
      companysubtype_ID: row.data.companysubtype_ID,
      companyparent_ID: row.data.companyparent_ID,
      companystatus_ID: row.data.companystatus_ID,
      businessnature_ID: row.data.businessnature_ID,
      start_DATE: row.data.start_DATE,
      end_DATE: row.data.end_DATE,
      companylogo_PATH: row.data.companylogo_PATH,
      file: File = null,
      isactive: row.data.isactive
    };
    if (row.data.isactive == "Y") {
      this.editcompany.company.isactive = true;
    } else {
      this.editcompany.company.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

  spinnerOn() {
    this.spinnercount = 0;
    this.spinner.show();
  }

  spinnerOff() {
    this.spinnercount = this.spinnercount + 1;
    if (this.spinnercount >= 1) {
      this.spinner.hide();
    }
  }
}
