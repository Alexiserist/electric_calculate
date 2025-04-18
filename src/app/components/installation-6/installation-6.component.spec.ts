import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Installation6Component } from './installation-6.component';

describe('Installation6Component', () => {
  let component: Installation6Component;
  let fixture: ComponentFixture<Installation6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Installation6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Installation6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
