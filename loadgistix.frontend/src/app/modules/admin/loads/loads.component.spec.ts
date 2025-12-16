import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadsComponent } from './loads.component';
import { SqlService } from '../../../services/sql.service';
import { AuthService } from 'app/core/auth/auth.service';

describe('LoadsComponent', () => {
  let component: LoadsComponent;
  let fixture: ComponentFixture<LoadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoadsComponent, HttpClientTestingModule],
      providers: [SqlService, AuthService]
    });
    fixture = TestBed.createComponent(LoadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
