import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerForm } from './manager-form';

describe('ManagerForm', () => {
  let component: ManagerForm;
  let fixture: ComponentFixture<ManagerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
