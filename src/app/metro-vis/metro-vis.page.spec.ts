import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MetroVisPage } from './metro-vis.page';

describe('MetroVisPage', () => {
  let component: MetroVisPage;
  let fixture: ComponentFixture<MetroVisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetroVisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MetroVisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
