import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private auth: AngularFireAuth,
        private router: Router,
        private navController: NavController,
        ) { }

    public login(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.auth.auth.signInWithEmailAndPassword(email, password).then(credentials => {
            this.navigateHome();
            return credentials;
        });
    }

    public signUp(email: string, password: string) {
        return this.auth.auth.createUserWithEmailAndPassword(email, password).then(credentials => {
            this.navigateHome();
            return credentials;
        });
    }

    public logout() {
        return this.auth.auth.signOut().then(() => {
            this.navigateHome();
        });
    }

    private navigateHome() {
        this.navController.navigateRoot('home')
            .catch(err => console.error(err));
    }

    public getUser() {
        return this.auth.user;
    }
}
