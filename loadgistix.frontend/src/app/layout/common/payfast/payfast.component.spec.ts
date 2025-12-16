import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PayfastComponent } from './payfast.component';

describe('PayfastComponent', () => {
  let component: PayfastComponent;
  let fixture: ComponentFixture<PayfastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PayfastComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    });
    fixture = TestBed.createComponent(PayfastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
