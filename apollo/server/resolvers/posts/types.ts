import { PostCategory } from '@prisma/client';
import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql';
import { CreatePost, ServerPost, ServerPostPreview, UpdatePost } from '../../../../types/Post';
import { ObjectIdScalar } from '../../types/ObjectIdScalar';
import { Comment } from '../comments/types';
import { User } from '../users/types';

registerEnumType(PostCategory, { name: 'PostCategory' });

@ObjectType()
export class PostPreview implements ServerPostPreview {
  @Field(() => ObjectIdScalar) id: string;
  @Field() date: Date;
  @Field({ nullable: true }) image: string | null;
  @Field() title: string;
  @Field(() => User) user: User;
}

@ObjectType()
export class Post implements ServerPost {
  @Field(() => ObjectIdScalar) id: string;
  @Field() title: string;
  @Field() text: string;
  @Field({ nullable: true }) image: string | null;
  @Field() date: Date;
  @Field(() => PostCategory) category: PostCategory;
  @Field() published: boolean;
  @Field() userId: string;
  @Field(() => User) user: User;
  @Field(() => [Comment]) comments: Comment[];
}

@InputType()
export class CreatePostInput implements CreatePost {
  @Field(() => PostCategory) category: PostCategory;
  @Field() text: string;
  @Field() title: string;
  @Field(() => [Int], { nullable: true }) imageData?: number[];
}

@InputType()
export class UpdatePostInput implements UpdatePost {
  @Field(() => PostCategory, { nullable: true }) category?: PostCategory;
  @Field({ nullable: true }) text?: string;
  @Field({ nullable: true }) title?: string;
  @Field(() => [Int], { nullable: true }) imageData?: number[];
}
