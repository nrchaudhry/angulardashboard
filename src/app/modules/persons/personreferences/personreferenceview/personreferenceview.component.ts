import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-personreferenceview',
  templateUrl: './personreferenceview.component.html',
  styleUrls: ['./personreferenceview.component.css']
})
export class PersonreferenceviewComponent implements OnInit {
 
  personreferenceID = 0;
 person_ID = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.personreference) {
        this.personreferenceID = params.personreference;
      }
    });
  }
  cancel() {
    this.router.navigate(["/home/references"], { queryParams: {} });
  }
  next() {
    this.router.navigate(['/home/employment'], { queryParams: { person: this.person_ID } });
  }
  previous() {
    this.router.navigate(['/home/membership'], { queryParams: { person: this.person_ID } });
  }
}
