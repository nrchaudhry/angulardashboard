import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersoncommunicationletterComponent } from 'src/app/components/person/personcommunicationletter/personcommunicationletter.component';

@Component({
  selector: 'app-letterview',
  templateUrl: './letterview.component.html',
  styleUrls: ['./letterview.component.css']
})
export class LetterviewComponent implements OnInit {
  @ViewChild("personcommunicationletters") personcommunicationletters: PersoncommunicationletterComponent;

   personletterID = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params. personcommunicationletter) {
        this. personletterID = params. personcommunicationletter;
      }
    });
  }

  refresh() {
    this.personcommunicationletters.load(true);
    this.cancel();
  }

  cancel() {
    this.router.navigate(["/home/communications"], { queryParams: {} });
  }
}
