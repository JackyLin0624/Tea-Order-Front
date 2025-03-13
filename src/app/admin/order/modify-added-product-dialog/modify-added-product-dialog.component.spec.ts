import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAddedProductDialogComponent } from './modify-added-product-dialog.component';

describe('ModifyAddedProductDialogComponent', () => {
  let component: ModifyAddedProductDialogComponent;
  let fixture: ComponentFixture<ModifyAddedProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyAddedProductDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyAddedProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
