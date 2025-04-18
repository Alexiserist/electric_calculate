import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Installation5Component } from './installation-5.component';

describe('Installation5Component', () => {
  let component: Installation5Component;
  let fixture: ComponentFixture<Installation5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Installation5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Installation5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
