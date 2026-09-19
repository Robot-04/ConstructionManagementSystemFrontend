import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEditDialog } from './material-edit-dialog';

describe('MaterialEditDialog', () => {
  let component: MaterialEditDialog;
  let fixture: ComponentFixture<MaterialEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialEditDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialEditDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
