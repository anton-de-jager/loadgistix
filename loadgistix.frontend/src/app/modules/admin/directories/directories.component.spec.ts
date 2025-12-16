import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DirectoriesComponent } from './directories.component';
import { SqlService } from '../../../services/sql.service';
import { AuthService } from 'app/core/auth/auth.service';

describe('DirectoriesComponent', () => {
  let component: DirectoriesComponent;
  let fixture: ComponentFixture<DirectoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DirectoriesComponent, HttpClientTestingModule],
      providers: [SqlService, AuthService]
    });
    fixture = TestBed.createComponent(DirectoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
