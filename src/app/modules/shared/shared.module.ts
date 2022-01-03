import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from '../../partials/header/header.component';

const components = [
  HeaderComponent
]

@NgModule({
  declarations: [
    components
  ],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
  ],
  exports: [
    components,
    FormsModule,
    CommonModule,
  ]

})
export class SharedModule { }
