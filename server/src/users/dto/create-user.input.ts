import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'The first name of the user' })
  @IsString()
  @Length(3, 30)
  firstname: string;

  @Field({ description: 'The last name of the user' })
  @IsString()
  @Length(3, 30)
  lastname: string;

  @Field({ description: 'The email of the user' })
  @IsEmail()
  email: string;

  @Field({ description: 'The password of the user' })
  @IsString()
  @Length(8, 20)
  password: string;

  @Field({
    defaultValue: 'USER',
    description: 'The role of the user (USER or ADMIN)',
  })
  userRole: string;
}
