import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogoutPageRoutingModule } from './logout-routing.module';

import { LogoutPage } from './logout.page';
import {HeaderModule} from '../header/header.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LogoutPageRoutingModule,
        HeaderModule
    ],
  declarations: [LogoutPage]
})
export class LogoutPageModule {}
