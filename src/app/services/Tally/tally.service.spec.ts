import { TestBed } from '@angular/core/testing';

import { TallyService } from './tally.service';

describe('TallyService', () => {
  let service: TallyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TallyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
