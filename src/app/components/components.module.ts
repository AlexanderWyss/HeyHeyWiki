import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderSidebarComponent } from './header-sidebar/header-sidebar.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    HeaderSidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
  ],
  exports: [
    HeaderSidebarComponent,
  ],
})
export class ComponentsModule { }
