import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDTO {
    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;

    @IsOptional()
    @IsBoolean()
    readonly isActive: boolean;
}
