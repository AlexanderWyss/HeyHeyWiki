import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubwikiPage } from './subwiki.page';
import {RouterModule} from '@angular/router';
import {HeaderModule} from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{
      path: '',
      component: SubwikiPage
    }]),
    HeaderModule
  ],
  declarations: [SubwikiPage]
})
export class SubwikiPageModule {}
