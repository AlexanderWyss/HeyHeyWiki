import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../firestore.service';
import {MenuController} from '@ionic/angular';
import {SubWiki} from '../_models/sub-wiki';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    private subwikis: SubWiki[];
    public searchableSubwikis: SubWiki[];

    constructor(
        private firestore: FirestoreService,
        private menuController: MenuController,
    ) {
    }

    ngOnInit(): void {

    }


    ionViewWillEnter() {
        this.menuController.enable(false);
        this.firestore.getSubWikis().subscribe(subwikis => {
            this.subwikis = subwikis;
            this.searchableSubwikis = this.subwikis;
        });
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

    openSubwiki() {
        console.log('not opening because not implemented :(');
    }
}
