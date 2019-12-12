import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private firestore: FirestoreService,
    private menuController: MenuController,
  ) { }

  ngOnInit(): void {
    this.firestore.getSubWikis().subscribe(value => console.log(value));
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
  }
}
