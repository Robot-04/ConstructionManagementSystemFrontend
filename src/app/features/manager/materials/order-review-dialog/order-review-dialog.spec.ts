import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReviewDialog } from './order-review-dialog';

describe('OrderReviewDialog', () => {
  let component: OrderReviewDialog;
  let fixture: ComponentFixture<OrderReviewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderReviewDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderReviewDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
