import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRejectDialogTs } from './order-reject-dialog.ts.js';

describe('OrderRejectDialogTs', () => {
  let component: OrderRejectDialogTs;
  let fixture: ComponentFixture<OrderRejectDialogTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderRejectDialogTs],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderRejectDialogTs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
