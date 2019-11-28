import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-sidebar',
  templateUrl: './header-sidebar.component.html',
  styleUrls: ['./header-sidebar.component.scss'],
})
export class HeaderSidebarComponent implements OnInit {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Test',
      url: '/test',
      icon: 'beer'
    }
  ];
  constructor() { }

  ngOnInit() {}

}
