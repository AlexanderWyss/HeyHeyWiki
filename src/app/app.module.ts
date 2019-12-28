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
import {CreateSubwikiPage} from './create-subwiki/create-subwiki.page';
import {CreateSubwikiPageModule} from './create-subwiki/create-subwiki.module';
import {CreatePagePageModule} from './create-page/create-page.module';
import {CreatePagePage} from './create-page/create-page.page';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [CreateSubwikiPage, CreatePagePage],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        QuillModule.forRoot({
            modules: {
                syntax: true,
            }
        }),
        CreateSubwikiPageModule,
        CreatePagePageModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
