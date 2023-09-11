import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field({ description: 'The first name of the user' })
  firstname: string;

  @Field({ description: 'The last name of the user' })
  lastname: string;

  @Field({ description: 'The username of the user' })
  username: string;

  @Field({ description: 'The password of the user' })
  password: string;

  @Field({
    defaultValue: 'USER',
    description: 'The role of the user (USER or ADMIN)',
  })
  userRole: string;
}
