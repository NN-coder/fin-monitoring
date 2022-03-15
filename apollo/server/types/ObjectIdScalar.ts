import { GraphQLScalarType } from 'graphql';

const objectIdRegExp = /^[0-9A-Fa-f]{24}$/;

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  serialize(value: unknown): string {
    if (typeof value !== 'string' || !objectIdRegExp.test(value))
      throw new Error('ObjectIdScalar can only serialize 12 bytes hex strings');

    return value;
  },
  parseValue(value: unknown): string {
    if (typeof value !== 'string' || !objectIdRegExp.test(value))
      throw new Error('ObjectIdScalar can only parse 12 bytes hex strings');

    return value;
  },
  parseLiteral(ast): string {
    if (ast.kind !== 'StringValue' || !objectIdRegExp.test(ast.value))
      throw new Error('ObjectIdScalar can only parse 12 bytes hex strings');

    return ast.value;
  },
});
