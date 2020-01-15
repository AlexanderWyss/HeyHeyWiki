import { Component, OnInit } from '@angular/core';

import { ModalController, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirestoreService } from './firestore.service';
import { ResolveEnd, Router } from '@angular/router';
import { PageInfo } from './_models/pageInfo';
import { CreatePagePage } from './create-page/create-page.page';
import { AuthService } from './auth.service';

interface Category {
    name: string;
    expanded: boolean;
    pages: PageInfo[];
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public appPages: Category[] = [];
    public name: string;
    private content: PageInfo[];
    private unsubscribe: Promise<firebase.Unsubscribe>;

    public isAuthenticated = false;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private firestore: FirestoreService,
        private router: Router,
        private navController: NavController,
        private modalController: ModalController,
        private auth: AuthService,
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
                    const name = params.get('name');
                    if (name !== this.name) {
                        this.name = name;
                        this.appPages = [];
                        if (this.unsubscribe) {
                            this.unsubscribe.then(unsub => unsub());
                        }
                        this.unsubscribe = this.firestore.listenPageInfosOfSubwikiByName(this.name, pageInfos => {
                            this.content = pageInfos;
                            this.appPages = [];
                            pageInfos.forEach(page => {
                                this.addCategory(page);
                            });
                        });
                    }
                }
            }
        });
        this.auth.getUser().subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
            } else {
                this.isAuthenticated = false;
            }
        });
    }

    private addCategory(page) {
        if (this.appPages[page.category] === undefined) {
            this.appPages[page.category] = {
                name: page.category,
                expanded: false,
                pages: [page]
            };
        } else {
            this.appPages[page.category].pages.push(page);
        }
    }

    toggle(category: Category) {
        category.expanded = !category.expanded;
    }

    navigate(page: PageInfo) {
        return this.navController.navigateForward(['subwiki', this.name, page.title]);
    }

    createPage() {
        this.modalController.create({
            component: CreatePagePage,
            componentProps: {
                subwikiName: this.name
            }
        }).then(modal => {
            modal.onDidDismiss().then(result => {
                this.addCategory(result.data.page);
                this.navigate(result.data.page);
            });
            modal.present();
        });
    }
}
