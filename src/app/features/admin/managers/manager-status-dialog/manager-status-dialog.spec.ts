import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerStatusDialog } from './manager-status-dialog';

describe('ManagerStatusDialog', () => {
  let component: ManagerStatusDialog;
  let fixture: ComponentFixture<ManagerStatusDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerStatusDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerStatusDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
