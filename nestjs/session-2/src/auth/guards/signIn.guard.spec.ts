// https://kr.coderbridge.com/questions/972748b876514ea2a815b1be1aab7b8e
// https://github.com/jmcdo29/testing-nestjs/tree/main/apps/complex-sample/src/cat
// https://stackoverflow.com/questions/67496417/how-to-do-unit-testing-for-guard-in-nest
// https://stackoverflow.com/questions/62595603/nestjs-how-can-i-mock-executioncontext-in-canactivate
// https://stackoverflow.com/questions/67832906/unit-testing-nestjs-guards-unknown-authentication-strategy
// https://stackoverflow.com/questions/18452147/mocking-passport-js-local-strategy-in-a-unit-test

import { SignInGuard } from './signIn.guard';
import * as httpMocks from 'node-mocks-http';
import * as passport from 'passport';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
// https://github.com/cszatmary/passport-mock-strategy
import { MockStrategy } from 'passport-mock-strategy';

describe('SignInGuard', () => {
  let guard: SignInGuard;

  beforeAll(() => {
    passport.use('local', new MockStrategy());
    // https://stackoverflow.com/questions/19948816/passport-js-error-failed-to-serialize-user-into-session
    passport.serializeUser((user, done) => {
      done(null, user);
    });
  });

  beforeEach(() => {
    guard = new SignInGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('return true', async () => {
    const httpMock = httpMocks.createRequest();

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => httpMock,
        getResponse: jest.fn(),
      }),
    });

    expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();
  });
});
