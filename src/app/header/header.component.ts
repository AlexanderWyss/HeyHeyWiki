import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {ModalController, NavController} from '@ionic/angular';
import {SubWiki} from '../_models/sub-wiki';
import {EditSubwikiPage} from '../edit-subwiki/edit-subwiki-page.component';
import {FirestoreService} from '../firestore.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    @Input() title: string;
    @Input() searchBar: boolean;
    @Input() isSubwiki: boolean;

    user: string;
    query: string;

    constructor(private authService: AuthService,
                private navController: NavController,
                private modalController: ModalController,
                private firestoreService: FirestoreService) {
    }

    ngOnInit() {
        this.authService.getUser().subscribe(user => {
            if (user) {
                this.user = user.email.split('@')[0];
            } else {
                this.user = null;
            }
        });
    }

    signUp() {
        this.navController.navigateForward('register');
    }

    login() {
        this.navController.navigateForward('login');
    }

    logout() {
        this.authService.logout();
    }

    home() {
        this.navController.navigateForward('home');
    }

    search() {
        if (this.query !== undefined && this.query.trim() !== '') {
            this.navController.navigateForward(['subwiki', this.title, 'search', this.query]);
        }
    }

    editSubwiki() {
        this.firestoreService.getSubWikiByName(this.title).then(subwiki =>
            this.modalController.create({
                component: EditSubwikiPage,
                componentProps: {
                    subwiki
                }
            }).then(modal => {
                modal.onDidDismiss().then(result => {
                    if (result.data) {
                        this.navController.navigateForward(['subwiki', result.data.subwiki.name]);
                    }
                });
                modal.present();
            }));
    }
}
