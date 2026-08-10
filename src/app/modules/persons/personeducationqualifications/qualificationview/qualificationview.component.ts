import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PersoneducationqualificationComponent } from 'src/app/components/person/personeducationqualification/personeducationqualification.component';

@Component({
  selector: 'app-qualificationview',
  templateUrl: './qualificationview.component.html',
  styleUrls: ['./qualificationview.component.css']
})
export class QualificationviewComponent implements OnInit {
  @ViewChild("personeducationqualification") personeducationqualification: PersoneducationqualificationComponent;

  personqualificationID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.personeducationqualification) {
        this.personqualificationID = params.personeducationqualification;
      }
    });
  }

  cancel() {
    this.personeducationqualification.load(true);
    this.router.navigate(["/home/qualifications"], { queryParams: {} });
  }
}
