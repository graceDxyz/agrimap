import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/signIn.input';
import { SignInResponse } from './dto/signIn-response';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { IGqlContext } from './entities/auth.entity';

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
