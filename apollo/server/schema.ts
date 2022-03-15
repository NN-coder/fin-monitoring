import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import * as resolvers from './resolvers';

export const schema = buildSchemaSync({
  resolvers: Object.values(resolvers) as any,
});
