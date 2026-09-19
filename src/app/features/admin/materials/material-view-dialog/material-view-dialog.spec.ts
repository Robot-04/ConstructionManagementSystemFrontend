import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialViewDialog } from './material-view-dialog';

describe('MaterialViewDialog', () => {
  let component: MaterialViewDialog;
  let fixture: ComponentFixture<MaterialViewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialViewDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialViewDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
