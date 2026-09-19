import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteViewDialog } from './site-view-dialog';

describe('SiteViewDialog', () => {
  let component: SiteViewDialog;
  let fixture: ComponentFixture<SiteViewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteViewDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteViewDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
