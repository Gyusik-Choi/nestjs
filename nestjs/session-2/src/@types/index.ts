/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import { UserAccount } from '../../src/entities/userAccount.entity';

declare global {
  namespace Express {
    export interface User extends UserAccount {}
  }
}
