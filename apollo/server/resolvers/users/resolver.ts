import { Ctx, Query, Resolver } from 'type-graphql';
import { AuthorizedError } from '../../../../errors/AuthorizedError';
import { Context } from '../../types/Context';
import { User } from './types';

@Resolver()
export class UsersResolver {
  @Query(() => User)
  me(@Ctx() { session }: Context): User {
    if (!session?.user) throw new AuthorizedError();
    return session.user;
  }
}
