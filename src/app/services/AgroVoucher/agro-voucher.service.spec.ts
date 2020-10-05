import { TestBed } from '@angular/core/testing';

import { AgroVoucherService } from './agro-voucher.service';

describe('AgroVoucherService', () => {
  let service: AgroVoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgroVoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
