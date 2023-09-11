import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator'; // Import IsUUID from class-validator

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID, { description: 'The ID of the user to update' })
  @IsUUID('4') // Validate that the ID is a valid UUID version 4
  id: string;
}
