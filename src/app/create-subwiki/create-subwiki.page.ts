import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FirestoreService} from '../firestore.service';

@Component({
    selector: 'app-create-subwiki',
    templateUrl: './create-subwiki.page.html',
    styleUrls: ['./create-subwiki.page.scss'],
})
export class CreateSubwikiPage implements OnInit {
    name: string;
    error: string;

    constructor(private firestore: FirestoreService, private modalController: ModalController) {
    }

    ngOnInit() {
    }

    cancel() {
        this.modalController.dismiss();
    }

    create() {
        if (!this.name || this.name.trim() === '') {
            this.error = 'Name is required.';
        } else {
            this.error = null;
        }
        const subwiki = {name: this.name, imageRef: null};
        this.firestore.createSubWiki(subwiki).then(ref => {
            this.modalController.dismiss({subwiki, ref: ref.id});
        });
    }
}
