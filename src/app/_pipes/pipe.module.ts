import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ResolveStoragePipe} from './resolve-storage.pipe';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [ResolveStoragePipe],
    exports: [ResolveStoragePipe]
})
export class PipeModule {
}
