import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';
import {RouterModule} from '@angular/router';
import {HeaderModule} from '../header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: SearchPage
      }
    ]),
    HeaderModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
