import { UserRole } from '@prisma/client';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { AuthorizedError } from '../../../../errors/AuthorizedError';
import { PermissionError } from '../../../../errors/PermissionError';
import { prisma } from '../../../../prisma';
import { Context } from '../../types/Context';
import { ObjectIdScalar } from '../../types/ObjectIdScalar';
import { Comment, CreateCommentInput, UpdateCommentInput } from './types';

@Resolver()
export class CommentsResolver {
  @Query(() => [Comment])
  async comments(): Promise<Comment[]> {
    return await prisma.comment.findMany({ include: { user: true }, orderBy: { date: 'desc' } });
  }

  @Mutation(() => Comment)
  async createComment(
    @Ctx() { session }: Context,
    @Arg('postId', () => ObjectIdScalar) postId: string,
    @Arg('data') data: CreateCommentInput
  ): Promise<Comment> {
    if (!session?.user) throw new AuthorizedError();

    return await prisma.comment.create({
      data: { userId: session.user.id, postId, ...data },
      include: { user: true },
    });
  }

  @Mutation(() => Comment)
  async updateComment(
    @Ctx() { session }: Context,
    @Arg('id', () => ObjectIdScalar) id: string,
    @Arg('data') data: UpdateCommentInput
  ): Promise<Comment> {
    if (!session?.user) throw new AuthorizedError();
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (session.user.role === UserRole.ADMIN || comment.userId === session.user.id)
      return await prisma.comment.update({ where: { id }, data, include: { user: true } });

    throw new PermissionError();
  }

  @Mutation(() => Comment)
  async deleteComment(
    @Ctx() { session }: Context,
    @Arg('id', () => ObjectIdScalar) id: string
  ): Promise<Comment> {
    if (!session?.user) throw new AuthorizedError();
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (session.user.role === UserRole.ADMIN || comment.userId === session.user.id)
      return await prisma.comment.delete({ where: { id }, include: { user: true } });

    throw new PermissionError();
  }
}
