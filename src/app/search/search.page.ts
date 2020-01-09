import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuController, NavController} from '@ionic/angular';
import {AngularFireFunctions} from '@angular/fire/functions';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    subwiki: string;
    query: string;
    result: string[];

    constructor(private menuController: MenuController, private route: ActivatedRoute, private navController: NavController,
                private functions: AngularFireFunctions) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.menuController.enable(true);
        this.route.paramMap.subscribe(params => {
            this.subwiki = params.get('name');
            this.query = params.get('query');
            this.functions.httpsCallable('search')({subwiki: this.subwiki, query: this.query}).subscribe(result => this.result = result);
        });
    }

    search() {
        if (this.query !== undefined && this.query.trim() !== '') {
            this.navController.navigateForward(['subwiki', this.subwiki, 'search', this.query]);
        }
    }

    navigateTo(page: string) {
        this.navController.navigateForward(['subwiki', this.subwiki, page]);
    }
}
