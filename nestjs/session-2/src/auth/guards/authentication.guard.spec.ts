import { AuthenticationGuard } from './authentication.guard';
import * as httpMocks from 'node-mocks-http';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  beforeEach(() => {
    guard = new AuthenticationGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should be true', async () => {
    const httpMock = httpMocks.createRequest({
      isAuthenticated: () => true,
    });

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => httpMock,
        getResponse: jest.fn(),
      }),
    });

    expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();
  });
});
