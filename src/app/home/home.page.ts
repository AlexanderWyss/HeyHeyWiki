import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../firestore.service';
import {MenuController, ModalController, NavController} from '@ionic/angular';
import {SubWiki} from '../_models/sub-wiki';
import {EditSubwikiPage} from '../edit-subwiki/edit-subwiki-page.component';
import { AuthService } from '../auth.service';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    private subwikis: SubWiki[];
    public searchableSubwikis: SubWiki[];

    public isAuthenticated = false;
    public imageLoaded = false;

    constructor(
        private firestore: FirestoreService,
        private menuController: MenuController,
        private navController: NavController,
        private modalController: ModalController,
        private auth: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.firestore.getSubWikis().subscribe(async subwikis => {
            this.subwikis = subwikis;
            this.searchableSubwikis = this.subwikis;
        });
    }


    ionViewWillEnter() {
        this.menuController.enable(false);
        this.auth.getUser().subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
            } else {
                this.isAuthenticated = false;
            }
        });
    }

    displayImage(subwiki: SubWiki) {
        this.subwikis.find(i => i.id === subwiki.id).imageHasLoaded = true;
    }

    onSubwikiSearchChange(event: any) {
        this.searchableSubwikis = this.subwikis;
        const searchTerm = event.target.value;

        if (searchTerm.trim() !== '') {
            this.searchableSubwikis = this.searchableSubwikis.filter(searchableSubwiki => {
                return (searchableSubwiki.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
            });
        }
    }

    openSubwiki(subwiki: SubWiki) {
        this.navController.navigateForward(['subwiki', subwiki.name]);
    }

    createSubwiki() {
        this.modalController.create({
            component: EditSubwikiPage
        }).then(modal => {
            modal.onDidDismiss().then(result => {
                if (result.data) {
                    this.openSubwiki(result.data.subwiki);
                }
            });
            modal.present();
        });
    }
}
