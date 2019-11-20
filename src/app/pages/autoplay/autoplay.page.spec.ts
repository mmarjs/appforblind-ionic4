import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoplayPage } from './autoplay.page';

describe('AutoplayPage', () => {
  let component: AutoplayPage;
  let fixture: ComponentFixture<AutoplayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoplayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoplayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
