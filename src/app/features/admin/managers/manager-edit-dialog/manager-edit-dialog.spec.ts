import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerEditDialog } from './manager-edit-dialog';

describe('ManagerEditDialog', () => {
  let component: ManagerEditDialog;
  let fixture: ComponentFixture<ManagerEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
