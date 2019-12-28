import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FirestoreService} from '../firestore.service';
import {SubWikiContent} from '../_models/sub-wiki-content';

@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.page.html',
    styleUrls: ['./create-page.page.scss'],
})
export class CreatePagePage implements OnInit {

    @Input() content: SubWikiContent;
    name: string;
    category: string;
    categories = [];
    error: string;

    constructor(private modalController: ModalController, private firestore: FirestoreService) {
    }

    ngOnInit() {
        this.content.pages.forEach(page => {
            if (page.category.trim() !== '') {
                this.categories[page.category] = page.category;
            }
        });
        console.log(this.categories);
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
      const page = {title: this.name, category: this.category, home: false};
      this.firestore.createPage(this.content.id, page).then(res => this.modalController.dismiss({page}));
    }

    setCategory(category: string) {
        this.category = category;
    }
}
