import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadsAvailableComponent } from './loads-available.component';

describe('LoadsAvailableComponent', () => {
  let component: LoadsAvailableComponent;
  let fixture: ComponentFixture<LoadsAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LoadsAvailableComponent ] // Import the standalone component instead of declaring it
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadsAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
