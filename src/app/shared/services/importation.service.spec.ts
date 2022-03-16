import { TestBed } from '@angular/core/testing';

import { ImportationService } from './importation.service';

describe('ImportationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImportationService = TestBed.get(ImportationService);
    expect(service).toBeTruthy();
  });
});
