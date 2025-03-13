import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyProductDialogComponent } from './modify-product-dialog.component';

describe('ModifyProductDialogComponent', () => {
  let component: ModifyProductDialogComponent;
  let fixture: ComponentFixture<ModifyProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyProductDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
