import {Component} from '@angular/core';

import {MenuController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {FirestoreService} from './firestore.service';
import {ActivatedRoute, ResolveEnd, Router} from '@angular/router';
import {Page} from './_models/page';

interface Category {
    name: string;
    expanded: boolean;
    pages: Page[];
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public appPages: Category[] = [];
    public name: string;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private firestore: FirestoreService,
        private router: Router,
        private navController: NavController
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
        this.router.events.subscribe(route => {
            if (route instanceof ResolveEnd && route.urlAfterRedirects.startsWith('/subwiki/')) {
                const params = route.state.root.firstChild.paramMap;
                if (params.has('name')) {
                  this.name = params.get('name');
                  this.appPages = [];
                  this.firestore.getContentByName(this.name).then(content => content.pages.forEach(page => {
                        if (this.appPages[page.category] === undefined) {
                            this.appPages[page.category] = {
                                name: page.category,
                                expanded: false,
                                pages: [page]
                            };
                        } else {
                            this.appPages[page.category].pages.push(page);
                        }
                    })).then(v  => console.log(this.appPages));
                }
            }
        });
    }

  toggle(category: Category) {
    category.expanded = !category.expanded;
  }

  navigate(page: Page) {
    return this.navController.navigateForward(['subwiki', this.name, page.title]);
  }
}
