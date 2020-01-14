import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MenuController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    email: string;
    password: string;
    validation: string;

    private isLoading = false;

    constructor(
        private auth: AuthService,
        private menuController: MenuController,
        private loadingController: LoadingController,
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.menuController.enable(false);
    }

    jumpToPassword() {
        document.getElementById('password').getElementsByTagName('input')[0].focus();
    }

    login() {
        if (this.email && this.password) {
            this.validation = '';
            this.presentLoading();
            this.auth.login(this.email, this.password).then(() => this.dismissLoading())
                .catch(() => {
                    this.validation = 'Email oder Passwort falsch.';
                    this.dismissLoading();
                });
        } else {
            this.validation = 'Bitte füllen Sie alle Felder aus.';
        }
    }

    async presentLoading() {
        this.isLoading = true;
        await this.loadingController.create({
            spinner: 'dots',
            duration: 10000
        }).then(a => {
            a.present().then(() => {
                if (!this.isLoading) {
                    a.dismiss();
                }
            });
        });
    }

    async dismissLoading() {
        this.isLoading = false;
        return await this.loadingController.dismiss();
    }
}
