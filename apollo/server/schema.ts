import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import { CommentsResolver } from './resolvers/comments/resolver';
import { PostsResolver } from './resolvers/posts/resolver';
import { UsersResolver } from './resolvers/users/resolver';

export const schema = buildSchemaSync({
  resolvers: [CommentsResolver, PostsResolver, UsersResolver],
});
