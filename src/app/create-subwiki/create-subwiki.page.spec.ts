import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateSubwikiPage } from './create-subwiki.page';

describe('CreateSubwikiPage', () => {
  let component: CreateSubwikiPage;
  let fixture: ComponentFixture<CreateSubwikiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubwikiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSubwikiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
