import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyOrderDialogComponent } from './modify-order-dialog.component';

describe('ModifyOrderDialogComponent', () => {
  let component: ModifyOrderDialogComponent;
  let fixture: ComponentFixture<ModifyOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyOrderDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
