import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CreateSubwikiPage} from './create-subwiki.page';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([{
            path: '',
            component: CreateSubwikiPage
        }])
    ],
    declarations: [CreateSubwikiPage]
})
export class CreateSubwikiPageModule {
}
