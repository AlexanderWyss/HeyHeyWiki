import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    @Input() title: string;

    user: string;

    constructor(private authService: AuthService,
                private navController: NavController) {
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
}
