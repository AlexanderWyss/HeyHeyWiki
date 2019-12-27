import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {MenuController} from '@ionic/angular';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.page.html',
    styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
    error: string;

    constructor(private auth: AuthService, private menuController: MenuController) {
    }
  ionViewWillEnter() {
    this.menuController.enable(false);
  }

    ngOnInit() {
        this.auth.logout().catch(msg => this.error = 'Ein Fehler ist aufgetreten: ' + msg);
    }
}
