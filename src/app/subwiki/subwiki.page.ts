import { Component, OnInit } from '@angular/core';
import {SubWiki} from '../_models/sub-wiki';
import {MenuController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-subwiki',
  templateUrl: './subwiki.page.html',
  styleUrls: ['./subwiki.page.scss'],
})
export class SubwikiPage implements OnInit {
  subwiki: SubWiki;

  constructor(private menuController: MenuController) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.menuController.enable(true);
  }
}
