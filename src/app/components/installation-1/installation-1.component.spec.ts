import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Installation1Component } from './installation-1.component';

describe('Installation1Component', () => {
  let component: Installation1Component;
  let fixture: ComponentFixture<Installation1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Installation1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Installation1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
