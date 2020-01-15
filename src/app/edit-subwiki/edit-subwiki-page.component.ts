import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FirestoreService} from '../firestore.service';
import {SubWiki} from '../_models/sub-wiki';

@Component({
    selector: 'app-edit-subwiki',
    templateUrl: './edit-subwiki-page.component.html',
    styleUrls: ['./edit-subwiki-page.component.scss'],
})
export class EditSubwikiPage implements OnInit {
    @Input() subwiki: SubWiki;

    name: string;
    error: string;
    imageRef: firebase.storage.Reference;
    uploading: boolean;

    constructor(private firestore: FirestoreService, private modalController: ModalController) {
    }

    ngOnInit() {
        if (this.subwiki) {
            this.name = this.subwiki.name;
            this.firestore.getStorageRefMetadata('subwiki', this.subwiki.imageRef).subscribe(ref => this.imageRef = ref);
        }
    }

    cancel() {
        this.deleteFile();
        this.modalController.dismiss();
    }

    create() {
        if (this.validate()) {
            const subwiki = {name: this.name, imageRef: this.imageRef.name};
            this.firestore.createSubWiki(subwiki).then(ref => {
                this.modalController.dismiss({subwiki, ref: ref.id});
            });
        }
    }

    edit() {
        if (this.validate()) {
            const subwiki = {name: this.name, imageRef: this.imageRef.name};
            this.firestore.updateSubWiki({id: this.subwiki.id, ...subwiki}).then(ref => {
                if (this.imageRef.name !== this.subwiki.imageRef) {
                    this.firestore.getStorageRef('subwiki', this.subwiki.imageRef).delete();
                }
                this.modalController.dismiss({subwiki, ref: ref.id});
            });
        }
    }

    validate() {
        if (!this.name || this.name.trim() === '' || !this.imageRef) {
            this.error = 'Name & Image are required.';
            return false;
        } else {
            this.error = null;
            return true;
        }
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
        if (this.imageRef && this.imageRef.name !== (this.subwiki ? this.subwiki.imageRef : '')) {
            console.log('del');
            this.imageRef.delete();
        }
    }
}
