import { TestBed } from '@angular/core/testing';

import { NarrationRequestService } from './narration-request.service';

describe('NarrationRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NarrationRequestService = TestBed.get(NarrationRequestService);
    expect(service).toBeTruthy();
  });
});
