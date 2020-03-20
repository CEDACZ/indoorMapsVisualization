import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExampleVisPageRoutingModule } from './example-vis-routing.module';

import { ExampleVisPage } from './example-vis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExampleVisPageRoutingModule
  ],
  declarations: [ExampleVisPage]
})
export class ExampleVisPageModule {}
