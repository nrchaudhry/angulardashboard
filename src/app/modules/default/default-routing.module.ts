import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotfoundComponent } from '../../pages/notfound/notfound.component';
import { DefaultComponent } from './default.component';
import { LoginComponent } from '../../pages/login/login.component';

const routes: Routes = [{
  path: '', component: DefaultComponent,
  children: [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
