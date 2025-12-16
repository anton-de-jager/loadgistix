import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayNightComponent } from './day-night.component';
import { FuseConfigService } from '@fuse/services/config';

describe('DayNightComponent', () => {
  let component: DayNightComponent;
  let fixture: ComponentFixture<DayNightComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DayNightComponent],
      providers: [
        FuseConfigService
      ]
    });
    fixture = TestBed.createComponent(DayNightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
