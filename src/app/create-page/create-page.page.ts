import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FirestoreService} from '../firestore.service';
import {PageInfo} from '../_models/pageInfo';
import {SubWiki} from '../_models/sub-wiki';

@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.page.html',
    styleUrls: ['./create-page.page.scss'],
})
export class CreatePagePage implements OnInit {

    @Input() subwikiName: string;
    subwiki: SubWiki;
    name: string;
    category: string;
    categories = [];
    error: string;

    constructor(private modalController: ModalController, private firestore: FirestoreService) {
    }

    ngOnInit() {
        this.firestore.getSubWikiByName(this.subwikiName).then(subwiki => {
            this.subwiki = subwiki;
            this.firestore.getPageInfosOfSubwikiById(this.subwiki.id).then(pageInfos => {
                pageInfos.forEach(page => {
                    if (page.category.trim() !== '') {
                        this.categories[page.category] = page.category;
                    }
                });
            });
        });
    }

    cancel() {
        this.modalController.dismiss();
    }

    create() {
        if (!this.name || this.name.trim() === '') {
            this.error = 'Name is required';
        } else {
            this.error = undefined;
        }
        this.firestore.createPage(this.name, this.category ? this.category : '', this.subwiki.id)
            .then(ref => this.firestore.fromRef(ref).then(page => this.modalController.dismiss({page})));
    }

    setCategory(category: string) {
        this.category = category;
    }
}
