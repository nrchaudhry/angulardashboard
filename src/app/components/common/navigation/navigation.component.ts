import { Component, OnInit, Input  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { setting } from '../../../setting';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isApplication = false;

  @Input()
  nextURL: String = "";

  @Input()
  previousURL: String = "";

  constructor(  
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.isApplication = setting.isApplication;
  }

  previous() {
    this.router.navigate([this.previousURL]);
  }

  close() {
    this.router.navigate(['/home/dashboard']);
  }

  next() {
    this.router.navigate([this.nextURL]);
  }
}
