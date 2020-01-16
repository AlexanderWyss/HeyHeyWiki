import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {FirestoreService} from '../firestore.service';
import {PageInfo} from '../_models/pageInfo';
import {SubWiki} from '../_models/sub-wiki';

@Component({
    selector: 'app-create-page',
    templateUrl: './edit-page-page.component.html',
    styleUrls: ['./edit-page-page.component.scss'],
})
export class EditPagePage implements OnInit {

    @Input() subwikiName: string;
    @Input() pageInfo: PageInfo;
    subwiki: SubWiki;
    name: string;
    category: string;
    categories = [];
    error: string;

    constructor(private modalController: ModalController, private firestore: FirestoreService, private alertController: AlertController) {
    }

    ngOnInit() {
        if (this.pageInfo) {
            this.name = this.pageInfo.title;
            this.category = this.pageInfo.category;
        }
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
        if (this.validate()) {
            this.firestore.createPage(this.name, this.category ? this.category : '', this.subwiki.id)
                .then(ref => this.firestore.fromRef(ref).then(page => this.modalController.dismiss({page})));
        }
    }

    edit() {
        if (this.validate()) {
            this.pageInfo.title = this.name;
            this.pageInfo.category = this.category ? this.category : '';
            this.firestore.updatePageInfo(this.pageInfo)
                .then(ref => this.firestore.fromRef(ref).then(page => this.modalController.dismiss({page, subwiki: this.subwikiName})));
        }
    }

    validate() {
        if (!this.name || this.name.trim() === '') {
            this.error = 'Name is required';
            return false;
        } else {
            this.error = undefined;
            return true;
        }
    }

    setCategory(category: string) {
        this.category = category;
    }

    delete() {
        this.alertController.create({
            header: 'Delete Page?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.firestore.deletePage(this.pageInfo);
                        this.modalController.dismiss({subwiki: this.subwikiName});
                    }
                }
            ]
        }).then(alert => alert.present());
    }
}
