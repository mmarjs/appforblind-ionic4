import { TestBed } from '@angular/core/testing';

import { VideoSearchService } from './video-search.service';

describe('VideoSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoSearchService = TestBed.get(VideoSearchService);
    expect(service).toBeTruthy();
  });
});
