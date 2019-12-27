import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubwikiPage } from './subwiki.page';

describe('SubwikiPage', () => {
  let component: SubwikiPage;
  let fixture: ComponentFixture<SubwikiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubwikiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubwikiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
