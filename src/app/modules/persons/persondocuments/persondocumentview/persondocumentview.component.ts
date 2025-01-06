import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersondocumentComponent } from 'src/app/components/person/persondocument/persondocument.component';

@Component({
  selector: 'app-persondocumentview',
  templateUrl: './persondocumentview.component.html',
  styleUrls: ['./persondocumentview.component.css']
})
export class PersondocumentviewComponent implements OnInit {
  @ViewChild("persondocuments") persondocuments: PersondocumentComponent;

  persondocumentID = 0;
  person_ID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.persondocument) {
        this.persondocumentID = params.persondocument;
      }
    });
  }

  refresh() {
    this.persondocuments.load(true);
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/documents"], { queryParams: {} });
  }

  next() {
    this.router.navigate(['/home/reference'], { queryParams: { person: this.person_ID } });
  }

  previous() {
    this.router.navigate(['/home/qualification'], { queryParams: { person: this.person_ID } });
  }
}
