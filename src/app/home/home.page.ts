import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private firestore: FirestoreService) {}

  ngOnInit(): void {
    this.firestore.getSubWikis().subscribe(value => console.log(value[0]));
  }
}


