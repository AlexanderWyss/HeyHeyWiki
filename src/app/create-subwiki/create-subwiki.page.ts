import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FirestoreService} from '../firestore.service';
import Reference = firebase.database.Reference;
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;

@Component({
    selector: 'app-create-subwiki',
    templateUrl: './create-subwiki.page.html',
    styleUrls: ['./create-subwiki.page.scss'],
})
export class CreateSubwikiPage implements OnInit {
    name: string;
    error: string;
    imageRef: firebase.storage.Reference;
    uploading: boolean;

    constructor(private firestore: FirestoreService, private modalController: ModalController) {
    }

    ngOnInit() {
    }

    cancel() {
        this.deleteFile();
        this.modalController.dismiss();
    }

    create() {
        if (!this.name || this.name.trim() === '' || !this.imageRef) {
            this.error = 'Name & Image are required.';
        } else {
            this.error = null;
        }
        const subwiki = {name: this.name, imageRef: this.imageRef.name};
        this.firestore.createSubWiki(subwiki).then(ref => {
            this.modalController.dismiss({subwiki, ref: ref.id});
        });
    }

    uploadFile(event) {
        this.uploading = true;
        this.deleteFile();
        this.firestore.uploadFile('subwiki', event.target.files[0]).then(upload => {
            this.imageRef = upload.ref;
            this.uploading = false;
        });
    }

    private deleteFile() {
        if (this.imageRef) {
            this.imageRef.delete();
        }
    }
}
