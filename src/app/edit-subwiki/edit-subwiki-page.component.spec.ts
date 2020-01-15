import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditSubwikiPage } from './edit-subwiki-page.component';

describe('CreateSubwikiPage', () => {
  let component: EditSubwikiPage;
  let fixture: ComponentFixture<EditSubwikiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubwikiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSubwikiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
