import { Request } from 'express';

interface AuthenticationInterface extends Request {
  email: string;
  password: string;
}

export default AuthenticationInterface;
