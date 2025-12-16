import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BidsComponent } from './bids.component';
import { UserService } from '../../../core/user/user.service';

describe('BidsComponent', () => {
  let component: BidsComponent;
  let fixture: ComponentFixture<BidsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BidsComponent, HttpClientTestingModule],
      providers: [UserService]
    });
    fixture = TestBed.createComponent(BidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
