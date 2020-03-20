import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetroVisPageRoutingModule } from './metro-vis-routing.module';

import { MetroVisPage } from './metro-vis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetroVisPageRoutingModule
  ],
  declarations: [MetroVisPage]
})
export class MetroVisPageModule {}
