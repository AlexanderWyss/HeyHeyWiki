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

    constructor(private firestore: FirestoreService, private modalController: ModalController) {
    }

    ngOnInit() {
    }

    cancel() {
        this.modalController.dismiss();
    }

    create() {
        const subwiki = {name: this.name, imageRef: null};
        this.firestore.createSubWiki(subwiki).then(ref => {
            this.modalController.dismiss({subwiki, ref: ref.id});
        });
    }
}
