import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MenuController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    email: string;
    password: string;
    repeatPassword: string;
    validation: string;

    private jumpFields: string[] = new Array();
    private isLoading = false;

    constructor(
        private auth: AuthService,
        private menuController: MenuController,
        private loadingController: LoadingController,
    ) {
    }

    ngOnInit() {
        this.jumpFields.push('email', 'password', 'repeatPassword');
    }

    ionViewWillEnter() {
        this.menuController.enable(false);
    }

    jumpToNext(n: number) {
        if (!(this.email && this.password && this.repeatPassword)) {
            document.getElementById(this.jumpFields[n]).getElementsByTagName('input')[0].focus();
        } else {
            this.signUp();
        }
    }

    signUp() {
        if (this.email && this.password && this.repeatPassword) {
            this.validation = '';
            if (this.password === this.repeatPassword) {
                this.presentLoading();
                this.auth.signUp(this.email, this.password).then(() => this.dismissLoading())
                    .catch(msg => {
                        this.validation = msg;
                        this.dismissLoading();
                    });
            } else {
                this.validation = 'Passwörter stimmen nicht überein.';
            }
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
