import { TestBed } from '@angular/core/testing';

import { SubmissionRecordsService } from './submission-records.service';

describe('SubmissionRecordsService', () => {
  let service: SubmissionRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
