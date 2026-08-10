import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { DefaultComponent } from './default.component';
import { DefaultRoutingModule } from './default-routing.module';

@NgModule({
  imports: [
    DefaultRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    DefaultComponent
  ]
})
export class DefaultModule {

  constructor() { }

  ngOnInit(): void {
  }
}
