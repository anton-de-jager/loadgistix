import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BusinessDirectoryComponent } from './business-directory.component';
import { SqlService } from '../../../services/sql.service';
import { AuthService } from 'app/core/auth/auth.service';

describe('BusinessDirectoryComponent', () => {
  let component: BusinessDirectoryComponent;
  let fixture: ComponentFixture<BusinessDirectoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BusinessDirectoryComponent, HttpClientTestingModule],
      providers: [SqlService, AuthService]
    });
    fixture = TestBed.createComponent(BusinessDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
