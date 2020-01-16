import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from '../environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {QuillModule} from 'ngx-quill';
import {EditSubwikiPage} from './edit-subwiki/edit-subwiki-page.component';
import {EditSubwikiPageModule} from './edit-subwiki/edit-subwiki.module';
import {EditPagePageModule} from './edit-page/edit-page.module';
import {EditPagePage} from './edit-page/edit-page-page.component';
import {AngularFireFunctionsModule, FUNCTIONS_REGION} from '@angular/fire/functions';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [EditSubwikiPage, EditPagePage],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireFunctionsModule,
        QuillModule.forRoot(),
        EditSubwikiPageModule,
        EditPagePageModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        { provide: FUNCTIONS_REGION, useValue: 'europe-west2' }
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
