import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  DxMenuModule,
  DxRangeSelectorModule,
  DxPopupModule,
  DxChartModule,
  DxPieChartModule,
  DxVectorMapModule,
  DxDataGridModule,
  DxBulletModule,
  DxButtonModule,
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxDropDownButtonModule,
} from 'devextreme-angular';
import { IconPickerModule } from "ngx-icon-picker";

import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    HomeRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
    SharedModule,
    DxMenuModule,
    DxRangeSelectorModule,
    DxPopupModule,
    DxChartModule,
    DxPieChartModule,
    DxVectorMapModule,
    DxDataGridModule,
    DxBulletModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxDropDownButtonModule,
    IconPickerModule,
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
  ]
})

export class HomeModule {

  constructor() { }

  ngOnInit(): void {
  }
}
