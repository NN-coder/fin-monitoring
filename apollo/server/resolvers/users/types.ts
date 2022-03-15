import { UserRole } from '@prisma/client';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { ServerUser } from '../../../../types/User';
import { ObjectIdScalar } from '../../types/ObjectIdScalar';

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
export class User implements ServerUser {
  @Field(() => ObjectIdScalar, { nullable: true }) id: string;
  @Field({ nullable: true }) name: string | null;
  @Field({ nullable: true }) image: string | null;
  @Field({ nullable: true }) email: string | null;
  @Field({ nullable: true }) emailVerified: Date | null;
  @Field(() => UserRole, { nullable: true }) role: UserRole;
}
