import { TestBed } from '@angular/core/testing';

import { AWSServiceService } from './awsservice.service';

describe('AWSServiceService', () => {
  let service: AWSServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AWSServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
