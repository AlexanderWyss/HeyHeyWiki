import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    email: string;
    password: string;
    repeatePassword: string;
    validation: string;

    constructor(private auth: AuthService) {
    }

    ngOnInit() {
    }

    signUp() {
        if (this.email && this.password && this.repeatePassword) {
            this.validation = '';
            if (this.password === this.repeatePassword) {
                this.auth.signUp(this.email, this.password).catch(msg => this.validation = msg);
            } else {
              this.validation = 'Passwörter stimmen nicht überein.';
            }
        } else {
            this.validation = 'Bitte füllen Sie alle Felder aus.';
        }
    }
}