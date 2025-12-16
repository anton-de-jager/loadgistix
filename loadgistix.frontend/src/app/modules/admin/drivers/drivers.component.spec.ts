import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DriversComponent } from './drivers.component';
import { UserService } from '../../../core/user/user.service';

describe('DriversComponent', () => {
  let component: DriversComponent;
  let fixture: ComponentFixture<DriversComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DriversComponent, HttpClientTestingModule],
      providers: [UserService]
    });
    fixture = TestBed.createComponent(DriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
