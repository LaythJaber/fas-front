import { TestBed } from '@angular/core/testing';

import { SmsConfigurationService } from './sms-configuration.service';

describe('SmsConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmsConfigurationService = TestBed.get(SmsConfigurationService);
    expect(service).toBeTruthy();
  });
});
