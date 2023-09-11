import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class SignInResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => User)
  user: User;
}
