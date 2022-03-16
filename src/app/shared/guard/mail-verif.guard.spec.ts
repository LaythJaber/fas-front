import { TestBed, async, inject } from '@angular/core/testing';

import { VerifyKeysGuard } from './verify-keys.guard';

describe('VerifyKeysGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifyKeysGuard]
    });
  });

  it('should ...', inject([VerifyKeysGuard], (guard: VerifyKeysGuard) => {
    expect(guard).toBeTruthy();
  }));
});
