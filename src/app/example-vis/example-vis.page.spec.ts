import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExampleVisPage } from './example-vis.page';

describe('ExampleVisPage', () => {
  let component: ExampleVisPage;
  let fixture: ComponentFixture<ExampleVisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleVisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleVisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
