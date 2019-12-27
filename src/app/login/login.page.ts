import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {MenuController} from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    email: string;
    password: string;
    validation: string;

    constructor(private auth: AuthService, private menuController: MenuController) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.menuController.enable(false);
    }

    login() {
        if (this.email && this.password) {
            this.validation = '';
            this.auth.login(this.email, this.password).catch(() => this.validation = 'Email oder Passwort falsch.');
        } else {
            this.validation = 'Bitte füllen Sie alle Felder aus.';
        }
    }
}
