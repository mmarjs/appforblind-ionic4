import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestVideosPage } from './latest-videos.page';

describe('LatestVideosPage', () => {
  let component: LatestVideosPage;
  let fixture: ComponentFixture<LatestVideosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestVideosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestVideosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
