import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProductDialogComponent } from './select-product-dialog.component';

describe('SelectProductDialogComponent', () => {
  let component: SelectProductDialogComponent;
  let fixture: ComponentFixture<SelectProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectProductDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
