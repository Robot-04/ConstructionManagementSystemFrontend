import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStatusDialog } from './material-status-dialog';

describe('MaterialStatusDialog', () => {
  let component: MaterialStatusDialog;
  let fixture: ComponentFixture<MaterialStatusDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialStatusDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialStatusDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
