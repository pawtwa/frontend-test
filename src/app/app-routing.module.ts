import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './home/components/list/list.component';
import { SingleComponent } from './home/components/single/single.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    children: [
      {
        path: '',
        outlet: 'content',
        component: ListComponent
      },
    ]
  },
  {
    path: ':id',
    pathMatch: 'full',
    component: HomeComponent,
    children: [
      {
        path: '',
        outlet: 'content',
        component: SingleComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
