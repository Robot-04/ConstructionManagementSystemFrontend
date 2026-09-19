import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteStatusDialog } from './site-status-dialog';

describe('SiteStatusDialog', () => {
  let component: SiteStatusDialog;
  let fixture: ComponentFixture<SiteStatusDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteStatusDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteStatusDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
