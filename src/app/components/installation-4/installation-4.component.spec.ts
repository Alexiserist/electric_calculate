import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Installation4Component } from './installation-4.component';

describe('Installation4Component', () => {
  let component: Installation4Component;
  let fixture: ComponentFixture<Installation4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Installation4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Installation4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
