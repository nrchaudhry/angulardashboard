import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

import { CompanyComponent } from 'src/app/components/company/company/company.component';

@Component({
  selector: 'app-companyview',
  templateUrl: './companyview.component.html',
  styleUrls: ['./companyview.component.css']
})
export class CompanyviewComponent implements OnInit {
  @ViewChild("company") company: CompanyComponent;

  companyID = 0;
  spinnercount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.company) {
        this.companyID = params.company;
      }
    });
  }

  refresh() {
    this.company.load(true);
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/companies"], { queryParams: {} });
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
