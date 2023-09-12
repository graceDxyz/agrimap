import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInResponse } from './dto/signIn-response';
import { SignInInput } from './dto/signIn.input';
import { IGqlContext } from './entities/context.entity';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResponse)
  @UseGuards(GqlAuthGuard)
  signInUser(
    @Args('signInInput') _: SignInInput,
    @Context() context: IGqlContext,
  ) {
    return this.authService.signIn(context.user);
  }
}
