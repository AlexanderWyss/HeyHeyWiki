import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { MenuController, NavController } from '@ionic/angular';
import { SubWiki } from '../_models/sub-wiki';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private subwikis: SubWiki[];
  public searchableSubwikis: SubWiki[];

  public isLoggedIn = false;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private authService: AuthService,
    private firestore: FirestoreService,
    private menuController: MenuController,
    private navController: NavController,
  ) { }

  ngOnInit(): void {
    this.firestore.getSubWikis().subscribe(subwikis => {
      this.subwikis = subwikis;
      this.searchableSubwikis = this.subwikis;
    });
  }

  ionViewWillEnter() {
    this.menuController.enable(false);
    this.checkLogin();
  }

  signUp() {
    this.navController.navigateForward('register');
  }

  login() {
    this.navController.navigateForward('login');
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }

  onSubwikiSearchChange(event: any) {
    this.searchableSubwikis = this.subwikis;
    const searchTerm = event.target.value;

    if (searchTerm.trim() != '') {
      this.searchableSubwikis = this.searchableSubwikis.filter(searchableSubwiki => {
        return (searchableSubwiki.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      });
    }
  }

  openSubwiki() {
    console.log('not opening because not implemented :(');
  }

  checkLogin() {
    this.angularFireAuth.authState.pipe(first()).toPromise().then(data => {
      if (data) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      };
    });
  }
}
