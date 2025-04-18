import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Installation7Component } from './installation-7.component';

describe('Installation7Component', () => {
  let component: Installation7Component;
  let fixture: ComponentFixture<Installation7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Installation7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Installation7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
