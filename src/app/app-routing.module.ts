import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'home',loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)},
  {path:'',loadChildren: () => import('./modules/default/default.module').then(m => m.DefaultModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
