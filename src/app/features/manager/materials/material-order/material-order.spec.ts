import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialOrder } from './material-order';

describe('MaterialOrder', () => {
  let component: MaterialOrder;
  let fixture: ComponentFixture<MaterialOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
