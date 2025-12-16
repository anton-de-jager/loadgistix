import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { AdvertsComponent } from './adverts.component';

describe('AdvertsComponent', () => {
  let component: AdvertsComponent;
  let fixture: ComponentFixture<AdvertsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdvertsComponent, MatDialogModule]
    });
    fixture = TestBed.createComponent(AdvertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
