import { Field, InputType, ObjectType } from 'type-graphql';
import { CreateComment, ServerComment, UpdateComment } from '../../../../types/Comment';
import { ObjectIdScalar } from '../../types/ObjectIdScalar';
import { User } from '../users/types';

@ObjectType()
export class Comment implements ServerComment {
  @Field(() => ObjectIdScalar) id: string;
  @Field() text: string;
  @Field() date: Date;
  @Field() userId: string;
  @Field() postId: string;
  @Field(() => User) user: User;
}

@InputType()
export class CreateCommentInput implements CreateComment {
  @Field() text: string;
}

@InputType()
export class UpdateCommentInput implements UpdateComment {
  @Field({ nullable: true }) text?: string;
}
