import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../entities/userAccount.entity';
import { SignUpDataDTO } from './dto/signUpData.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async signUp(signUpData: SignUpDataDTO): Promise<string> {
    const { email, password } = signUpData;

    const emailResult: boolean = this.isEmail(email);

    if (emailResult === false) {
      throw new BadRequestException('이메일 형식을 확인해주세요');
    }

    await this.isEmailExist(email);

    if (!this.isPasswordValidate(password)) {
      throw new BadRequestException();
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    signUpData.password = hashedPassword;

    if (!(await this.saveUser(signUpData))) {
      throw new InternalServerErrorException('회원 가입에 실패했습니다');
    }

    return '회원 가입에 성공했습니다';
  }

  isEmail(email: string): boolean {
    // https://github.com/manishsaraan/email-validator
    const emailRegex =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (emailRegex.test(email)) {
      return true;
    }

    return false;
  }

  isPasswordValidate(password: string): boolean {
    // https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (passwordRegex.test(password)) {
      return true;
    }

    return false;
  }

  async isEmailExist(email: string): Promise<void> {
    try {
      const emailExistResult = await this.userAccountRepository.findOne({
        where: {
          email: email,
        },
      });

      if (emailExistResult) {
        throw new BadRequestException();
      }
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async saveUser(signUpData: SignUpDataDTO): Promise<boolean> {
    try {
      await this.userAccountRepository.save(signUpData);
      return true;
    } catch (err) {
      return false;
    }
  }

  // async signIn(signInData: SignInDataDTO) {
  //   console.log(signInData);
  // }

  async getById(id: number): Promise<UserAccount> {
    const user: UserAccount = await this.userAccountRepository.findOne({
      where: {
        id: id,
      },
    });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this email does not exist');
  }

  async getByEmail(email: string): Promise<UserAccount> {
    const user: UserAccount = await this.userAccountRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this email does not exist');
  }

  public async getAuthenticatedUser(
    email: string,
    plainPassword: string,
  ): Promise<UserAccount> {
    try {
      const user: UserAccount = await this.getByEmail(email);
      await this.checkPassword(plainPassword, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  private async checkPassword(plainPassword: string, hashedPassword: string) {
    if (!(await bcrypt.compare(plainPassword, hashedPassword))) {
      throw new BadRequestException();
    }
  }
}
