import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EditSubwikiPage} from './edit-subwiki-page.component';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([{
            path: '',
            component: EditSubwikiPage
        }])
    ],
    declarations: [EditSubwikiPage]
})
export class EditSubwikiPageModule {
}
