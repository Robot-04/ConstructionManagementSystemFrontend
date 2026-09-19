import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditDialog } from './site-edit-dialog';

describe('SiteEditDialog', () => {
  let component: SiteEditDialog;
  let fixture: ComponentFixture<SiteEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
