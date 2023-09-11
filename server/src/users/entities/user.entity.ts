import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
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

  @Field({ description: 'The timestamp when the user record was created' })
  createdAt: Date;

  @Field({ description: 'The timestamp when the user record was last updated' })
  updatedAt: Date;
}
