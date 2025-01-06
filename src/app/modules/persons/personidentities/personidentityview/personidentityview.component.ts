import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonidentityComponent } from 'src/app/components/person/personidentity/personidentity.component';


@Component({
  selector: 'app-personidentityview',
  templateUrl: './personidentityview.component.html',
  styleUrls: ['./personidentityview.component.css']
})
export class PersonidentityviewComponent implements OnInit {
  @ViewChild("personidentity") personidentity: PersonidentityComponent;

  personidentityID = 0;
  person_ID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.personidentity) {
        this.personidentityID = params.personidentity;
      }
    });
  }

  refresh() {
    this.personidentity.load(true);
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/personal"], { queryParams: {} });
  }
  next() {
    this.router.navigate(['/home/reference'], { queryParams: { person: this.person_ID } });
  }
  previous() {
    this.router.navigate(['/home/qualification'], { queryParams: { person: this.person_ID } });
  }
}
