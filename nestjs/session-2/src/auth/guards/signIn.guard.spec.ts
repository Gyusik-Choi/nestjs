// https://kr.coderbridge.com/questions/972748b876514ea2a815b1be1aab7b8e
// https://github.com/jmcdo29/testing-nestjs/tree/main/apps/complex-sample/src/cat
// https://stackoverflow.com/questions/67496417/how-to-do-unit-testing-for-guard-in-nest

import { SignInGuard } from './signIn.guard';
import * as httpMocks from 'node-mocks-http';

describe('SignInGuard', () => {
  let guard: SignInGuard;

  beforeEach(() => {
    guard = new SignInGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('return true', () => {

  });
});
