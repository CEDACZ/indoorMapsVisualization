import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExampleVisPage } from './example-vis.page';

const routes: Routes = [
  {
    path: '',
    component: ExampleVisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExampleVisPageRoutingModule {}
