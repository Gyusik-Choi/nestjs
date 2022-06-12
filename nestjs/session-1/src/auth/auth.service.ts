import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../entities/userAccount.entity';
import { Request } from 'express';
import { UserInputDataDTO } from './dto/userInputData.dto';
import * as bcrypt from 'bcrypt';
import { SignInInfo } from './dto/signInInfo.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async signUp(userInputData: UserInputDataDTO) {
    const { email, password } = userInputData;

    // 이메일 형식 맞는지
    const emailResult: boolean = this.isEmail(email);

    if (emailResult === false) {
      throw new BadRequestException(
        '잘못된 이메일 형식',
        '이메일 형식을 확인해주세요',
      );
    }

    // 이미 존재하는 이메일인지
    const [emailExistError, emailExistResult]: [Error, null] | [null, boolean] =
      await this.isEmailExist(email);

    if (emailExistResult === null) {
      throw new InternalServerErrorException();
    }

    if (emailExistError !== null && emailExistResult) {
      throw new BadRequestException();
    }

    // 비밀번호 조건 맞는지
    const passwordValidateResult: boolean = this.isPasswordValidate(password);

    if (passwordValidateResult === false) {
      throw new BadRequestException();
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    userInputData.password = hashedPassword;

    const [error, data]: [Error, null] | [null, UserAccount] =
      await this.saveUser(userInputData);

    if (data === null) {
      throw new InternalServerErrorException(error, '회원 가입에 실패했습니다');
    }

    return '회원 가입에 성공했습니다';
  }

  async isEmailExist(email: string): Promise<[Error, null] | [null, boolean]> {
    try {
      const emailExistResult = await this.userAccountRepository.findOne({
        where: {
          email: email,
        },
      });

      if (emailExistResult) {
        return [null, true];
      }

      return [null, false];
    } catch (err) {
      return [err, null];
    }
  }

  isEmail(email: string) {
    // https://github.com/manishsaraan/email-validator
    const emailRegex =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (emailRegex.test(email)) {
      return true;
    }

    return false;
  }

  isPasswordValidate(password: string) {
    // https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (passwordRegex.test(password)) {
      return true;
    }

    return false;
  }

  async saveUser(
    userInputData: UserInputDataDTO,
  ): Promise<[Error, null] | [null, UserAccount]> {
    try {
      const result = await this.userAccountRepository.save(userInputData);
      return [null, result];
    } catch (err) {
      return [err, null];
    }
  }

  async signIn(request: Request, signInInfo: SignInInfo) {
    const { email, password } = signInInfo;

    const [userExistError, userExistData]: [Error, null] | [null, UserAccount] =
      await this.userExist(email);

    if (userExistData === null) {
      console.log(userExistError);
      // throw new BadRequestException();
      return false;
    }

    const userID: number = userExistData.id;
    const userPassword: string = userExistData.password;

    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      userPassword,
    );

    if (isPasswordMatch === false) {
      // throw new BadRequestException();
      return false;
    }

    // https://www.youtube.com/watch?v=c-84CzCEaPs (10분 30초 ~)
    // saveUninitialized 가 false 인 상태에서
    // session 객체를 수정하게 되면
    // initailized 가 된다
    // maxAge 기간 동안 sessionID 가 같은 값이 나오게 된다
    // saveUninitialized 가 false 인 상태에서
    // session 객체를 수정하지 않으면
    // sessionID 는 매번 요청때 마다 바뀐다
    console.log(request.session);
    console.log(request.sessionID);
    request.session['isAuthenticated'] = true;
    request.session['userID'] = userID;
    return true;
  }

  async userExist(email: string): Promise<[Error, null] | [null, UserAccount]> {
    try {
      const result: UserAccount = await this.userAccountRepository.findOne({
        email: email,
      });

      if (result === undefined) {
        throw new NotFoundException();
      }

      return [null, result];
    } catch (err) {
      return [err, null];
    }
  }
}
