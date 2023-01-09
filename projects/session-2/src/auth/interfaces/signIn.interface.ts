import { Request } from 'express';

interface SignInInterface extends Request {
  email: string;
  password: string;
}

export default SignInInterface;
